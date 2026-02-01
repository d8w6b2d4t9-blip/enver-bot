import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { text: "안녕! 전장의 아이돌 엔젤릭버스터야! 무엇이든 물어봐! 뾰로롱! ☆", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: "Error connecting to server!", sender: 'bot' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] border-4 border-pink-300">

        {/* Header */}
        <div className="bg-pink-500 p-4 text-white font-bold text-xl text-center shadow-md">
          Angelic Buster Chat
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-pink-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                ? 'bg-pink-400 text-white rounded-br-none'
                : 'bg-white border-2 border-pink-200 text-pink-800 rounded-bl-none shadow-sm'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-pink-200 text-pink-400 p-3 rounded-2xl rounded-bl-none shadow-sm animate-pulse">
                Singing...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-pink-100 flex gap-2">
          <input
            type="text"
            className="flex-1 border-2 border-pink-200 rounded-full px-4 py-2 focus:outline-none focus:border-pink-500 text-pink-700 placeholder-pink-300"
            placeholder="Talk to Angelic Buster..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 py-2 font-bold transition-colors shadow-md"
          >
            Send
          </button>
        </div>

        {/* Footer info */}
        <div className="pb-2 text-center">
          <span className="text-[10px] text-pink-300 font-medium bg-pink-50 px-3 py-1 rounded-full">
            💖 에스카다가 ChatGPT의 마법을 빌려왔어! ✨
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
