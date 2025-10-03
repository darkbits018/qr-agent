import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, X, Filter, Search } from 'lucide-react';
import MenuCarousel from '../components/MenuCards/MenuCarousel';
import { customerApi } from '../api/customerApi';
import { useCart } from '../context/CartContext';
import CartSlideOver from '../components/PaymentPanel/CartSlideOver';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, addToCart, removeFromCart, toggleCart } = useCart();

  const filters = [
    { id: 'all', name: 'All Items' },
    { id: 'veg', name: 'Vegetarian' },
    { id: 'non-veg', name: 'Non-Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'gluten-free', name: 'Gluten Free' },
  ];

  // Group items by category
  const groupByCategory = useCallback((items) => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, []);

  // Apply filters and search
  const getFilteredItems = useCallback(() => {
    let filtered = [...menuItems];
    // Apply dietary filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter((item) =>
        item.dietary_tag?.toLowerCase().includes(activeFilter)
      );
    }
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [menuItems, activeFilter, searchQuery]);

  // Get categorized items
  const categorizedItems = groupByCategory(getFilteredItems());

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await customerApi.getMenu();
        if (Array.isArray(response)) {
          const availableItems = response.filter((item) => item.is_available);
          setMenuItems(availableItems);
        } else {
          throw new Error('Invalid menu format');
        }
      } catch (err) {
        setError(err.message || 'Failed to load menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="p-6 bg-white rounded-xl shadow-lg text-center max-w-md"
        >
          <h2 className="text-xl font-bold text-purple-800 mb-2">Error Loading Menu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );

  if (!menuItems.length)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-white rounded-xl shadow-lg text-center max-w-md"
        >
          <h2 className="text-xl font-bold text-purple-800 mb-2">Menu Unavailable</h2>
          <p className="text-gray-600">Currently no menu items are available. Please check back later.</p>
        </motion.div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-purple-50 to-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-purple-50 transition-colors"
        >
          <ChevronLeft className="text-purple-700" />
        </motion.button>
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
        >
          Premium Menu
        </motion.h1>
        <div className="relative">
          <motion.button
            onClick={toggleCart}
            className="relative p-2 rounded-full bg-[#4C4C9D] text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                {cart.items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-3 top-3.5 text-purple-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-purple-400 hover:text-purple-600"
            >
              <X size={18} />
            </button>
          )}
        </motion.div>
      </div>

      {/* Filter Button */}
      <div className="px-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
        </motion.button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4"
          >
            <div className="flex flex-wrap gap-2 py-4">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {filter.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Sections as Carousels */}
      <div className="pb-24 px-4">
        {Object.keys(categorizedItems).length > 0 ? (
          Object.entries(categorizedItems).map(([category, items]) => (
            <MenuCarousel
              key={category}
              title={category}
              items={items}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              cartItems={cart.items}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-purple-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
      <CartSlideOver />
    </motion.div>
  );
};

export default MenuPage;