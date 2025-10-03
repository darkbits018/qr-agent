import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const MenuCard = ({ item, onAddToCart, onRemoveFromCart, cartItems = [] }) => {
  const [tapCount, setTapCount] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Ensure cartItems is always an array
  if (!Array.isArray(cartItems)) {
    console.error('Invalid cartItems prop:', cartItems);
    cartItems = [];
  }

  // Find the cart item corresponding to this menu item
  const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  // Handle tap events
  const handleTap = () => {
    setTapCount((prev) => prev + 1);
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (tapCount === 0) {
        // Single tap: Add to cart
        onAddToCart(item);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1000);
      }
      setTapCount(0);
    }, 300);
    setTimer(newTimer);
    if (tapCount === 1) {
      // Double tap: Remove from cart
      clearTimeout(newTimer);
      onRemoveFromCart(item.id);
      setTapCount(0);
    }
  };

  // Dietary tag colors
  const dietaryColors = {
    veg: 'bg-green-100 text-green-800',
    'non-veg': 'bg-red-100 text-red-800',
    vegan: 'bg-blue-100 text-blue-800',
    'gluten-free': 'bg-yellow-100 text-yellow-800',
  };
  const dietaryColor =
    dietaryColors[item.dietary_tag?.toLowerCase()] || 'bg-gray-100 text-gray-800';

  // Collect all available images
  const images = [
    item.image_url,
    item.image1,
    item.image2,
    item.image3,
    item.image4
  ].filter(Boolean); // Remove undefined/null

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(168, 85, 247, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleTap}
      className={`relative w-72 rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer transition-all duration-300 ${
        isHovered ? 'ring-2 ring-purple-300' : ''
      }`}
    >
      {/* Quantity Indicator */}
      {quantity > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center z-10 shadow-md"
        >
          {quantity}
        </motion.div>
      )}
      {/* Added Confirmation */}
      <AnimatePresence>
        {isAdded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-purple-600 bg-opacity-90 flex items-center justify-center z-20"
          >
            <div className="text-white text-center p-4">
              <Plus className="mx-auto mb-2" size={24} />
              <p className="font-bold">Added to cart</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {images.length === 1 ? (
          <motion.img
            initial={{ scale: 1 }}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.5 }}
            src={images[0]}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex gap-2 overflow-x-auto h-full">
            {images.map((img, idx) => (
              <motion.img
                key={idx}
                initial={{ scale: 1 }}
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                src={img}
                alt={`${item.name} ${idx + 1}`}
                className="h-44 w-44 object-cover rounded"
              />
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Dietary Tag */}
        {item.dietary_tag && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${dietaryColor}`}
          >
            {item.dietary_tag}
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-purple-600 font-bold text-lg whitespace-nowrap ml-2"
          >
            ₹{item.price?.toFixed(2) || 'N/A'}
          </motion.div>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {item.description || 'Delicious item description'}
        </p>
        {/* Custom Controls */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          className="flex justify-center gap-2 mt-3 overflow-hidden"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromCart(item.id);
            }}
            className="p-1 bg-purple-100 text-purple-700 rounded-full"
          >
            <Minus size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="p-1 bg-purple-600 text-white rounded-full"
          >
            <Plus size={16} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuCard;