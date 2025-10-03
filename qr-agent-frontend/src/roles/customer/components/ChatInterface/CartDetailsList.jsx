import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = () => (
  <div className="min-w-[260px] h-32 bg-[#f8f6ff] rounded-lg shadow-md p-4 flex space-x-4 animate-pulse border border-[#ded7f3]">
    <div className="w-20 h-20 bg-gray-300 rounded-md skeleton" />
    <div className="flex flex-col justify-between flex-1">
      <div className="w-3/4 h-4 bg-gray-300 rounded skeleton" />
      <div className="w-full h-3 bg-gray-200 rounded skeleton" />
      <div className="w-1/2 h-4 bg-gray-300 rounded skeleton" />
    </div>
  </div>
);

const CartDetailsList = ({ items = [], loading = false, onUpdateQuantity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="w-full mt-4 p-3 bg-[#fdfcff] border border-[#dcd2fa] rounded-xl shadow-inner"
    >
      <h3 className="text-md font-bold text-[#4d2c91] mb-1 px-1">🛒 Your Cart</h3>

      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : items.length === 0 ? (
              <p className="text-gray-500 text-sm">Cart's empty. Add some magic 🌟</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[260px] bg-white border border-[#e0d4ff] rounded-xl shadow-sm p-3 flex space-x-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <h4 className="text-sm font-semibold text-[#4b3b78] truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-bold text-[#2d174d]">₹{item.price}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-sm font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
                        >−</button>
                        <span className="text-sm text-gray-700">{item.quantity || 1}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-sm font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>
    </motion.div>
  );
};

export default CartDetailsList;
