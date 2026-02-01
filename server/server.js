const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Angelic Buster Chatbot Server is running!');
});

const { queryRAG } = require('./rag');

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);

    try {
        const reply = await queryRAG(message);
        res.json({ reply });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ reply: "오류가 발생했어! 에스카다가 아픈가봐 ㅠㅠ" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port} (bound to 0.0.0.0)`);
});
