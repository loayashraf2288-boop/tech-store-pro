import { useState } from 'react';
import { getAIResponse } from '../services/gemini';

const AIChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'مرحباً! كيف يمكنني مساعدتك في TECHSTORE؟' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const reply = await getAIResponse(input);
    setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 bg-neon text-black p-4 rounded-full shadow-lg z-50">
        💬
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-dark-card border border-dark-border rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-dark-border flex justify-between">
            <h3 className="text-neon">دعم TECHSTORE</h3>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-neon text-black' : 'bg-gray-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400">يكتب...</div>}
          </div>
          <div className="p-3 border-t border-dark-border flex">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} className="flex-1 bg-dark border border-dark-border rounded-l-lg p-2 text-white text-sm" placeholder="اسأل عن المنتجات..." dir="rtl"/>
            <button onClick={sendMessage} className="bg-neon text-black px-4 rounded-r-lg">إرسال</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
