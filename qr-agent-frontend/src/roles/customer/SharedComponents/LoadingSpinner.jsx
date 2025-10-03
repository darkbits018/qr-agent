import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', color = '#4C4C9D', text }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizes[size]} rounded-full border-2 border-t-transparent`}
        style={{ borderColor: color, borderTopColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-[#7A7F87]"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}