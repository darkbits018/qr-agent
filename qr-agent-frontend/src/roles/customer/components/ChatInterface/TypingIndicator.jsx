import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-start mb-3"
    >
      <div className="rounded-2xl py-3 px-4 bg-[#EEF1F4] text-[#1A1A1A] rounded-tl-none">
        <div className="flex space-x-2">
          <motion.div 
            animate={{ 
              scale: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }} 
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0 
            }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
          <motion.div 
            animate={{ 
              scale: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }} 
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.2 
            }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
          <motion.div 
            animate={{ 
              scale: [0.5, 1, 0.5],
              opacity: [0.5, 1, 0.5]
            }} 
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.4 
            }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
        </div>
      </div>
    </motion.div>
  );
}