import React from 'react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message, isLast }) {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {/* <div
        className={`rounded-2xl py-3 px-4 max-w-[80%] ${
          isUser 
            ? 'bg-[#4C4C9D] text-white rounded-tr-none' 
            : 'bg-[#EEF1F4] text-[#1A1A1A] rounded-tl-none'
        }`}
      >
        <p>{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-[#7A7F87]'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div> */}
      <div
  className={`rounded-2xl py-3 px-4 max-w-[80%] flex items-end ${
    isUser 
      ? 'bg-[#4C4C9D] text-white rounded-tr-none' 
      : 'bg-[#EEF1F4] text-[#1A1A1A] rounded-tl-none'
  }`}
>
  <p className="flex-grow">
    {message.text}
  </p>
  <p className={`text-[10px] ml-2 ${isUser ? 'text-blue-100' : 'text-[#7A7F87]'}`}>
    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </p>
</div>
    </motion.div>
  );
}