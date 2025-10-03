import React from 'react';
import { motion } from 'framer-motion';

const SkeletonOrderCard = () => (
  <div className="min-w-[200px] h-24 bg-[#f8f6ff] rounded-md shadow-sm p-2 flex space-x-3 animate-pulse border border-[#ded7f3]">
    <div className="w-16 h-16 bg-gray-300 rounded skeleton" />
    <div className="flex flex-col justify-between flex-1">
      <div className="w-3/4 h-3 bg-gray-300 rounded skeleton" />
      <div className="w-full h-2.5 bg-gray-200 rounded skeleton" />
      <div className="w-1/2 h-3 bg-gray-300 rounded skeleton" />
    </div>
  </div>
);

const OrderedItemsList = ({ items = [], loading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="w-full mt-3 p-2 bg-[#fdfcff] border border-[#dcd2fa] rounded-lg shadow-inner"
    >
      <h3 className="text-sm font-semibold text-[#4d2c91] mb-1 px-1">🍽️ Your Orders</h3>

      <div className="flex space-x-3 overflow-x-auto pb-1 scrollbar-hide">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <SkeletonOrderCard key={i} />)
        ) : items.length === 0 ? (
          <div className="min-w-full text-center py-3">
            <p className="text-gray-500 text-xs">No orders yet 😔</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="min-w-[200px] bg-white border border-[#e0d4ff] rounded-lg shadow-xs p-2 flex space-x-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded border border-gray-200"
              />
              <div className="flex flex-col justify-between flex-1">
                <h4 className="text-xs font-semibold text-[#4b3b78] truncate">{item.name}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs font-bold text-[#2d174d]">₹{item.price}</span>
                  {item.status && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      item.status === 'Delivered' 
                        ? 'bg-[#e6f7ee] text-[#0a7b4e]' 
                        : item.status === 'Cancelled'
                        ? 'bg-[#feeceb] text-[#d92c20]'
                        : 'bg-[#e3dbf9] text-[#4d2c91]'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default OrderedItemsList;