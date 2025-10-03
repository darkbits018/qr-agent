// //==========================================ORIGINAL+++++++++++++++++++++++++++++++++++++++++++++++++++
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { customerApi } from '../api/customerApi';

export function AppShell({ children }) {
  const [notification, setNotification] = useState(null); // Tracks notification status

  // Preload next possible routes
  useEffect(() => {
    // Preload all routes after initial render
    import('../pages/WelcomePage.jsx');
    import('../pages/ChatPage.jsx');
    import('../pages/MenuPage.jsx');
    import('../pages/PaymentPage.jsx');
  }, []);

  const handleCallWaiter = async () => {
    const tableId = sessionStorage.getItem('table_id') || 'default_table';
    try {
      await customerApi.callWaiter(tableId); // Call API to notify waiter
      setNotification({ type: 'success', message: 'Waiter has been notified!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to notify waiter.' });
    }
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#1A1A1A] overflow-x-hidden relative">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Call Waiter Button */}
      <button
        onClick={handleCallWaiter}
        className="fixed bottom-4 left-4 bg-[#4C4C9D] text-white p-3 rounded-full shadow-lg hover:bg-[#3a3a8d]"
      >
        <Bell size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto h-full min-h-screen relative"
      >
        {children}
      </motion.div>
    </div>
  );
}