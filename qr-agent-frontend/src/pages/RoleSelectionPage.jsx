// src/pages/RoleSelectionPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    switch (role) {
      case 'superadmin':
        navigate('/superadmin/dashboard');
        break;
      case 'orgadmin':
        navigate('/orgadmin/dashboard');
        break;
      case 'kitchen':
        navigate('/kitchen/dashboard');
        break;
      case 'customer':
        navigate('/customer/welcome');
        break;
      default:
        console.error('Invalid role selected');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Welcome to QR Agent</h1>
      <p className="text-lg mb-8">Please select your role:</p>
      <div className="space-y-4">
        <button
          onClick={() => handleRoleSelection('superadmin')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Super Admin
        </button>
        <button
          onClick={() => handleRoleSelection('orgadmin')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-green-600 transition-colors"
        >
          Organization Admin
        </button>
        <button
          onClick={() => handleRoleSelection('kitchen')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-yellow-600 transition-colors"
        >
          Kitchen Staff
        </button>
        <button
          onClick={() => handleRoleSelection('customer')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-purple-600 transition-colors"
        >
          Customer
        </button>
      </div>
    </motion.div>
  );
};

export default RoleSelectionPage;