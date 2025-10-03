import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const MenuCategorySection = ({ category, items, onAddToCart, onRemoveFromCart, getCartQuantity }) => {
  return (
    <div className="mb-8">
      <motion.h2 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-xl font-bold text-purple-800 mb-4 sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm py-2 z-10"
      >
        {category}
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => {
          const quantity = getCartQuantity(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-4 border border-purple-50 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {item.dietary_tag || 'Standard'}
                    </span>
                    <span className="ml-auto font-bold text-purple-700">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                
                {item.image && (
                  <div className="ml-4 w-20 h-20 rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex justify-end">
                {quantity > 0 ? (
                  <div className="flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1">
                    <button 
                      onClick={() => onRemoveFromCart(item.id)}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium text-purple-800">{quantity}</span>
                    <button 
                      onClick={() => onAddToCart(item)}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(item)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategorySection;