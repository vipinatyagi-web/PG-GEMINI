// components/ChatWidget.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { SiProbot } from 'react-icons/si';

type Msg = { sender: 'bot' | 'user'; text: string };

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { sender: 'bot', text: 'Namaste! Main aapka AI Pandit. Aap kya puchhna chahte hain?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages: Msg[] = [...messages, { sender: 'user', text: input }];
    const typed = input;
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: typed }),
      });
      const data = await res.json();
      const botText = data?.reply || 'Kuch takneeki samasya aa gayi hai.';
      setMessages([...newMessages, { sender: 'bot', text: botText }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: 'Kuch takneeki samasya aa gayi hai.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Ask Pandit"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-brand-dark flex items-center justify-center text-3xl z-50
                   shadow-[0_0_20px_rgba(255,209,102,0.5)] hover:scale-105 transition-transform
                   bg-gradient-to-tr from-brand-violet to-brand-gold"
      >
        <SiProbot />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 w-80 h-96 flex flex-col z-50
                       backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl shadow-2xl"
          >
            <div className="p-3 flex justify-between items-center bg-brand-violet/90 rounded-t-2xl">
              <h3 className="font-bold text-lg">Ask Pandit</h3>
              <button aria-label="Close" onClick={() => setIsOpen(false)} className="p-1 hover:opacity-80">
                <FaTimes />
              </button>
            </div>

            <div className="flex-grow p-3 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <span
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
                      ${msg.sender === 'bot'
                        ? 'bg-brand-violet/30 border border-brand-violet/40'
                        : 'bg-brand-gold text-brand-dark'}`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <span className="px-3 py-2 rounded-xl text-sm bg-brand-violet/30 border border-brand-violet/40">...</span>
                </div>
              )}
            </div>

            <div className="p-3 flex gap-2 border-t border-white/10 bg-black/40 rounded-b-2xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-grow bg-brand-dark border border-brand-violet/40 rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Apna sawaal likhein..."
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 rounded-lg text-black font-semibold bg-brand-gold hover:brightness-110"
                aria-label="Send"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
