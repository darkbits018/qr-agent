import React, { useState, useRef } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiLoader, FiCoffee, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Enhanced status configuration with better colors
const statusConfig = {
  pending: { 
    color: 'bg-amber-400', 
    icon: <FiClock className="text-white" />, 
    label: 'Pending',
    next: 'accepted'
  },
  accepted: { 
    color: 'bg-blue-500', 
    icon: <FiCheckCircle className="text-white" />, 
    label: 'Accepted',
    next: 'preparing'
  },
  preparing: { 
    color: 'bg-orange-500', 
    icon: <FiLoader className="text-white" />, 
    label: 'Preparing',
    next: 'ready'
  },
  ready: { 
    color: 'bg-purple-500', 
    icon: <FiCoffee className="text-white" />, 
    label: 'Ready',
    next: 'completed'
  },
  completed: { 
    color: 'bg-green-500', 
    icon: <FiTruck className="text-white" />, 
    label: 'Completed',
    next: null
  },
  cancelled: { 
    color: 'bg-red-500', 
    icon: <FiAlertCircle className="text-white" />, 
    label: 'Cancelled',
    next: null
  }
};

export default function Orders() {
  const { orders, updateOrderStatus, loading } = useKitchen();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');
  const [swiping, setSwiping] = useState(null); // null or orderId
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const orderRefs = useRef({});

  const filteredOrders = activeStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeStatus);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Swipe handlers (Mouse and Touch Support)
  const handleStart = (orderId, e) => {
    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    orderRefs.current[orderId] = { startX, currentX: startX };
    setSwiping(orderId); // store the orderId being swiped
  };

  const handleMove = (orderId, e) => {
    if (!swiping) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - orderRefs.current[orderId].startX;
    orderRefs.current[orderId].currentX = currentX;

    if (Math.abs(deltaX) > 5) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
      setSwipeProgress(Math.min(Math.abs(deltaX) / 80, 1)); // faster, more sensitive
    }
  };

  const handleEnd = (orderId) => {
    if (!swiping) return;
    const deltaX = orderRefs.current[orderId].currentX - orderRefs.current[orderId].startX;

    if (Math.abs(deltaX) > 40) { // less distance for faster swipe
      const currentStatus = orders.find(o => o.id === orderId)?.status;
      if (deltaX > 0) {
        // Right swipe: advance to next status if possible
        const nextStatus = statusConfig[currentStatus]?.next;
        if (nextStatus) handleStatusUpdate(orderId, nextStatus);
      } else {
        // Left swipe: cancel only if pending
        if (currentStatus === 'pending') handleStatusUpdate(orderId, 'cancelled');
      }
    }

    setSwiping(false);
    setSwipeDirection(null);
    setSwipeProgress(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-gray-800"
            whileHover={{ scale: 1.02 }}
          >
            Kitchen Orders
          </motion.h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full ${activeStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'}`}
              onClick={() => setActiveStatus('all')}
            >
              All Orders
            </motion.button>
            {Object.entries(statusConfig).map(([status, { color, icon, label }]) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 ${activeStatus === status ? `${color} text-white` : 'bg-white text-gray-700 border'}`}
                onClick={() => setActiveStatus(status)}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: swiping === order.id && swipeDirection
                      ? (swipeDirection === 'right' ? swipeProgress * 80 : -swipeProgress * 80)
                      : 0
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18, type: "tween" }} // snappier
                  className={`relative ${swiping === order.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onTouchStart={(e) => handleStart(order.id, e)}
                  onTouchMove={(e) => handleMove(order.id, e)}
                  onTouchEnd={() => handleEnd(order.id)}
                  onMouseDown={(e) => handleStart(order.id, e)}
                  onMouseMove={(e) => handleMove(order.id, e)}
                  onMouseUp={() => handleEnd(order.id)}
                >
                  {/* Swipe background indicators */}
                  <div className="absolute inset-0 flex overflow-hidden rounded-xl">
                    <motion.div 
                      className={`${statusConfig[statusConfig[order.status]?.next]?.color || 'bg-green-500'} w-full flex items-center justify-start pl-6`}
                      animate={{
                        opacity: swipeDirection === 'right' ? swipeProgress : 0,
                        width: swipeDirection === 'right' ? `${swipeProgress * 100}%` : '0%'
                      }}
                    >
                      <span className="text-white font-medium">
                        Mark as {statusConfig[order.status]?.next ? statusConfig[statusConfig[order.status].next].label : 'Completed'}
                      </span>
                    </motion.div>
                    <motion.div 
                      className={`${order.status === 'pending' ? 'bg-red-500' : 'bg-gray-500'} w-full flex items-center justify-end pr-6`}
                      animate={{
                        opacity: swipeDirection === 'left' ? swipeProgress : 0,
                        width: swipeDirection === 'left' ? `${swipeProgress * 100}%` : '0%'
                      }}
                    >
                      <span className="text-white font-medium">
                        {order.status === 'pending' ? 'Cancel Order' : 'Undo'}
                      </span>
                    </motion.div>
                  </div>

                  {/* Order card */}
                  <motion.div
                    className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${statusConfig[order.status]?.color} relative z-10`}
                    whileTap={{ scale: swiping ? 0.98 : 1 }}
                  >
                    <div 
                      className="p-6"
                      onClick={() => toggleExpandOrder(order.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${statusConfig[order.status]?.color || 'bg-gray-500'}`}>
                            {statusConfig[order.status]?.icon || <FiClock className="text-white" />}
                          </span>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
                            <p className="text-gray-500">Table {order.table_number}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-gray-700">
                            ₹{order.total}
                          </span>
                          <span className="text-sm text-gray-500">
                            {order.created_at ? formatTime(order.created_at) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-semibold text-lg mb-3 text-gray-800">Order Details</h4>
                            <div className="mb-6">
                              <h5 className="font-medium text-gray-700 mb-2">Ordered Items</h5>
                              {order.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                  {Object.entries(
                                    order.items.reduce((acc, item) => {
                                      const name = item.ordered_by || item.customer_name || 'Unknown';
                                      if (!acc[name]) acc[name] = [];
                                      acc[name].push(item);
                                      return acc;
                                    }, {})
                                  ).map(([customer, items]) => (
                                    <div key={customer} className="bg-gray-50 rounded-lg p-4">
                                      <div className="font-semibold text-indigo-600 mb-2">{customer}</div>
                                      <ul className="space-y-2">
                                        {items.map((item, idx) => (
                                          <motion.li 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
                                          >
                                            <div className="flex items-center space-x-3">
                                              <span className="font-medium">{item.name}</span>
                                              {item.special_instructions && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                  {item.special_instructions}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex items-center">
                                              <span className="text-gray-500 mx-2">× {item.quantity}</span>
                                              {item.price && (
                                                <span className="text-gray-700 font-medium">₹{item.price}</span>
                                              )}
                                            </div>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No items in this order</div>
                              )}
                            </div>
                            <div className="flex justify-end space-x-3">
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 rounded-full bg-red-500 text-white"
                                  onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                >
                                  Cancel Order
                                </motion.button>
                              )}
                              {statusConfig[order.status]?.next && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-6 py-2 rounded-full text-white ${statusConfig[statusConfig[order.status].next].color}`}
                                  onClick={() => handleStatusUpdate(order.id, statusConfig[order.status].next)}
                                >
                                  Mark as {statusConfig[statusConfig[order.status].next].label}
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">When new orders come in, they'll appear here</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}