// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import DynamicSubtitleBubble from './DynamicSubtitleBubble';
// import { useChat } from '../../context/ChatContext';

// export default function AvatarSection() {
//   const { messages, toggleChatMode } = useChat();
//   const [latestAIMessage, setLatestAIMessage] = useState('');

//   // Update the latest AI message whenever the messages array changes
//   useEffect(() => {
//     const agentMessage = messages.findLast((msg) => msg.sender === 'agent')?.text;
//     setLatestAIMessage(agentMessage || '');
//   }, [messages]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex flex-col items-center px-4 py-2"
//     >
//       {/* AI Avatar */}
//       <motion.div
//         onClick={toggleChatMode}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="w-16 h-16 rounded-full flex items-center justify-center bg-[#4C4C9D] text-white text-2xl font-medium cursor-pointer"
//       >
//         Rest
//       </motion.div>

//       {/* Label */}
//       <p className="text-xs mt-2 text-[#7A7F87]">AI Assistant</p>

//       {/* Dynamic Subtitle Bubble */}
//       <DynamicSubtitleBubble latestMessage={latestAIMessage} />
//     </motion.div>
//   );
// }

import React from 'react';
import { motion } from 'framer-motion';

export default function AvatarSection({ latestAIMessage, isFullChatMode, toggleChatMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-4 py-2"
    >
      {/* AI Avatar */}
      <motion.div
        onClick={toggleChatMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-[#4C4C9D] text-white text-2xl font-medium cursor-pointer"
      >
        Rest
      </motion.div>

      {/* Label */}
      <p className="text-xs mt-2 text-[#7A7F87]">AI Assistant</p>

      {/* Show agent bubble only if NOT in full chat mode and there is a message */}
      {!isFullChatMode && latestAIMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-white text-[#4C4C9D] px-4 py-2 rounded-xl shadow text-sm max-w-xs"
        >
          {latestAIMessage.text}
        </motion.div>
      )}
    </motion.div>
  );
}