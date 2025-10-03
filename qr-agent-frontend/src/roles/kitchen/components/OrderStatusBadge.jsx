import React from 'react';
import { motion } from 'framer-motion';

function OrderStatusBadge({ status }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          ring: 'ring-yellow-400',
          pulse: true
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          ring: 'ring-blue-400',
          pulse: true
        };
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          ring: 'ring-green-400',
          pulse: false
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          ring: 'ring-gray-400',
          pulse: false
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <motion.div
      className={`inline-flex items-center px-3 py-1 rounded-full ${styles.bg} ${styles.text} ring-1 ${styles.ring}`}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {styles.pulse && (
        <span className="relative flex h-2 w-2 mr-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.bg}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.bg}`}></span>
        </span>
      )}
      <span className="text-sm font-medium capitalize">
        {status.replace('_', ' ')}
      </span>
    </motion.div>
  );
}

export default OrderStatusBadge;