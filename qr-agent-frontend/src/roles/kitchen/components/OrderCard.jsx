import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

function OrderCard({ order, onStatusChange }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeElapsed = (timestamp) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium">Table {order.table}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{formatTime(order.created_at)}</span>
              <span className="mx-1">•</span>
              <span>{getTimeElapsed(order.created_at)} ago</span>
            </div>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.notes && (
                  <p className="text-sm text-gray-500">{item.notes}</p>
                )}
              </div>
              <span className="text-sm font-medium">x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex space-x-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusChange(order.id, 'in_progress')}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Start Preparing
            </button>
          )}
          
          {order.status === 'in_progress' && (
            <button
              onClick={() => onStatusChange(order.id, 'completed')}
              className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default OrderCard;