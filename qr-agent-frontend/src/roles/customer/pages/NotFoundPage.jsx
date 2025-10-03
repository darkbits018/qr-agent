import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F5F7FA]"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 10 }}
        className="text-9xl font-bold text-[#4C4C9D]"
      >
        404
      </motion.div>
      
      <h1 className="text-2xl font-bold mb-4 mt-2">Page Not Found</h1>
      <p className="text-[#7A7F87] mb-8 text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <motion.button
        onClick={() => navigate('/welcome')}
        className="btn-primary flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home size={20} className="mr-2" />
        Back to Home
      </motion.button>
    </motion.div>
  );
};

export default NotFoundPage;