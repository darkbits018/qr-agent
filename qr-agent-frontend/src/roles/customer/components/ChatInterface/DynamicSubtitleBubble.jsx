

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DynamicSubtitleBubble({ latestMessage }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset typing animation when `latestMessage` changes
  useEffect(() => {
    if (latestMessage) {
      setCurrentIndex(0); // Reset index for new message
      setDisplayText(''); // Clear previous text
    }
  }, [latestMessage]);

  // Typing animation effect
  useEffect(() => {
    if (!latestMessage || currentIndex >= latestMessage.length) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 30); // Adjust typing speed here (30ms per character)

    return () => clearTimeout(timer);
  }, [currentIndex, latestMessage]);

  // Update displayed text as the index increases
  useEffect(() => {
    if (latestMessage) {
      setDisplayText(latestMessage.slice(0, currentIndex));
    }
  }, [currentIndex, latestMessage]);

  return (
    <AnimatePresence>
      {latestMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex justify-center mt-4"
        >
          <div
            className="rounded-2xl py-3 px-4 bg-[#EEF1F4] text-[#1A1A1A] max-w-[90%]"
            style={{
              width: `${Math.min(displayText.length * 10, 300)}px`, // Dynamic sizing
            }}
          >
            <p>{displayText}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}