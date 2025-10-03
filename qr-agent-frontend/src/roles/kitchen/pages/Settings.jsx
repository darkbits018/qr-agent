// src/roles/kitchen/pages/Settings.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-[#F5F7FA] min-h-screen"
    >
      <h1 className="text-2xl font-bold text-[#FF6F61] mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[#FF6F61] mb-2">Account Settings</h3>
        <p className="text-gray-600">Update your profile and preferences here.</p>
      </div>
    </motion.div>
  );
};

export default Settings;