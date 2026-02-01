const { queryRAG } = require('./rag');

async function test() {
    console.log("Starting RAG test...");
    try {
        const reply = await queryRAG("엔젤릭버스터는 누구야?");
        console.log("Bot reply:", reply);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
