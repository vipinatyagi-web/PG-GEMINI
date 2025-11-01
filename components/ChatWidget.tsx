import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { SiProbot } from 'react-icons/si';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Namaste! Main aapka AI Pandit. Aap kya puchhna chahte hain?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const res = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
    } catch (error) {
        setMessages([...newMessages, { sender: 'bot', text: 'Kuch takneeki samasya aa gayi hai.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-16 h-16 bg-brand-gold rounded-full text-brand-dark flex items-center justify-center text-3xl shadow-lg z-50">
        <SiProbot />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-brand-bg rounded-2xl shadow-2xl flex flex-col z-50"
          >
            <div className="p-3 flex justify-between items-center bg-brand-violet rounded-t-2xl">
              <h3 className="font-bold text-lg">Ask Pandit</h3>
              <button onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>
            <div className="flex-grow p-3 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-brand-violet' : 'bg-brand-gold text-brand-dark'}`}>{msg.text}</span>
                </div>
              ))}
              {isLoading && <div className="text-left"><span className="inline-block p-2 rounded-lg bg-brand-violet">...</span></div>}
            </div>
            <div className="p-3 flex gap-2 border-t border-brand-violet">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-grow bg-brand-dark border border-brand-violet rounded-lg px-3 py-1.5 focus:outline-none" placeholder="Apna sawaal likhein..." />
              <button onClick={handleSend} className="px-3 bg-brand-gold text-brand-dark rounded-lg"><FaPaperPlane /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
