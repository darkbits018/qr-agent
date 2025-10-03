import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function InputSection() {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();
  
  const handleSend = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };
  
  // This would use Web Speech API in a real implementation
  const handleVoiceInput = () => {
    // Mock voice input for demo
    alert('Voice input is not available in this demo');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 bg-white border-t border-gray-200 p-3"
    >
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleVoiceInput}
          className="p-2 rounded-full text-[#7A7F87] hover:bg-gray-100"
        >
          <Mic size={20} />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 py-2 px-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#4C4C9D]"
        />
        
        <motion.button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full ${
            message.trim() ? 'bg-[#4C4C9D] text-white' : 'bg-gray-200 text-gray-400'
          }`}
          whileHover={message.trim() ? { scale: 1.05 } : {}}
          whileTap={message.trim() ? { scale: 0.95 } : {}}
        >
          <Send size={20} className="rotate-12" />
        </motion.button>
      </form>
    </motion.div>
  );
}