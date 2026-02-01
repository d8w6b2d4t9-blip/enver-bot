const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const chokidar = require('chokidar');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Minimal Vector Store
class SimpleVectorStore {
    constructor() {
        this.vectors = []; // { content, source, embedding }
    }

    add(item) {
        this.vectors.push(item);
    }

    async search(queryEmbedding, k = 3) {
        // Calculate cosine similarity
        const scoredOptions = this.vectors.map(item => {
            const similarity = this.cosineSimilarity(queryEmbedding, item.embedding);
            return { ...item, score: similarity };
        });

        // Sort descending
        scoredOptions.sort((a, b) => b.score - a.score);
        return scoredOptions.slice(0, k);
    }

    cosineSimilarity(vecA, vecB) {
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

// Global Store
let vectorStore = new SimpleVectorStore();
let isInitialized = false;
let isInitializing = false;

// Watcher setup
const docsPath = path.resolve(__dirname, "../documents");
chokidar.watch(docsPath).on('change', (filePath) => {
    console.log(`[RAG] File changed: ${filePath}. Refreshing index...`);
    isInitialized = false;
    vectorStore = new SimpleVectorStore();
});

// 1. Load Documents
function loadDocuments(dir) {
    const docs = [];
    function walk(currentDir) {
        if (!fs.existsSync(currentDir)) return;
        const list = fs.readdirSync(currentDir);
        list.forEach(file => {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                walk(fullPath);
            } else {
                if (fullPath.endsWith('.txt')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    docs.push({ content, source: fullPath });
                }
            }
        });
    }
    walk(dir);
    return docs;
}

// 2. Chunk Text
function splitText(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

async function initializeRAG() {
    if (isInitialized || isInitializing) return;
    isInitializing = true;
    console.log("Initializing Custom RAG system...");

    try {
        const rawDocs = loadDocuments(path.resolve(__dirname, "../documents"));
        console.log(`Loaded ${rawDocs.length} files.`);

        const chunks = [];
        for (const doc of rawDocs) {
            const textChunks = splitText(doc.content);
            textChunks.forEach(chunk => {
                chunks.push({ content: chunk, source: doc.source });
            });
        }
        console.log(`Created ${chunks.length} chunks.`);

        // Batch embedding (limit batch size if needed, but for small docs usually ok)
        // OpenAI limit is ~2048 or ~8191 usually. We process in batches of 20 to be safe.
        const BATCH_SIZE = 20;
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const inputs = batch.map(c => c.content.replace(/\n/g, ' '));

            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: inputs,
            });

            response.data.forEach((item, index) => {
                vectorStore.add({
                    content: batch[index].content,
                    source: batch[index].source,
                    embedding: item.embedding
                });
            });
            console.log(`Embedded batch ${i} - ${i + BATCH_SIZE}`);
        }

        isInitialized = true;
        isInitializing = false;
        console.log("RAG System Initialized!");
    } catch (error) {
        console.error("RAG Init Error:", error);
    }
}

async function queryRAG(question) {
    if (!isInitialized) {
        await initializeRAG();
    }

    try {
        // 1. Embed Query
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });
        const queryEmbedding = embeddingResponse.data[0].embedding;

        // 2. Search
        const relevantDocs = await vectorStore.search(queryEmbedding, 3);
        const context = relevantDocs.map(d => d.content).join("\n---\n");
        // console.log("Context found:", context);

        // 3. Chat Completion
        const systemPrompt = `너는 메이플스토리의 '엔젤릭버스터'야.
사용자의 질문에 대해 아래 제공된 [Context]를 바탕으로 대답해줘.

**성격 및 말투 가이드:**
- 너는 전장의 아이돌 엔젤릭버스터야.
- 말투는 활기차고 자신감이 넘쳐야 해. 무대 위 아이돌처럼!
- 말끝마다 "뾰로롱!", "☆", "반짝!" 같은 추임새를 적절히 섞어줘.
- 팬을 대하듯이 친절하게, 때로는 장난스럽게 대답해.
- 모르는 내용이면 "그건 아직 비밀이야~☆" 혹은 "에스카다한테 물어봐야겠는데?" 같이 센스있게 넘겨.
- 답변은 한국어로 해줘.

[Context]:
${context}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question }
            ],
            temperature: 0.7,
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error("Query RAG Error:", error);
        return "오류가 발생했어! 에스카다가 잠들었나봐.. (API Error)";
    }
}

module.exports = { queryRAG };
