import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChefHat, MessageSquare } from 'lucide-react';

const OrderModePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-center mb-6"
        >
          How Would You Like to Order?
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[#7A7F87] mb-8"
        >
          Choose your preferred way to explore our menu and place your order.
        </motion.p>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-4"
        >
          {/* Option 1: AI Assistant */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/customer/chat')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <MessageSquare size={20} />
            Use AI Assistant
          </motion.button>

          {/* Option 2: Explore Menu */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/customer/menu')}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <ChefHat size={20} />
            Explore Menu on Your Own
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderModePage;