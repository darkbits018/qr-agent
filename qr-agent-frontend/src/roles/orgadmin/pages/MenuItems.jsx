import React, { useEffect, useState } from 'react';
import { orgadminApi } from '../api/orgadminApi';
import { motion } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowUpTrayIcon as UploadIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const defaultItem = {
  name: '',
  price: 0,
  category: '',
  dietary_preference: '',
  available_times: [],
  is_available: true,
  img_url: '',
};

const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'];

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newItem, setNewItem] = useState(defaultItem);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [otherCategory, setOtherCategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // For preview
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await orgadminApi.getMenuItems();
      setItems(data.menu_items || data);
      setFilteredItems(data.menu_items || data);
    } catch (error) {
      console.error('Error fetching menu items:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [items, searchQuery, dietaryFilter, timeFilter, priceRange]);

  const applyFilters = () => {
    let result = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.dietary_preference.toLowerCase().includes(query)
      );
    }

    // Apply dietary filter
    if (dietaryFilter !== 'all') {
      result = result.filter(item => item.dietary_preference === dietaryFilter);
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      result = result.filter(item => {
        const times = item.available_times.split(',').map(t => t.trim());
        return times.includes(timeFilter) || times.includes('All Times');
      });
    }

    // Apply price filter
    result = result.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    setFilteredItems(result);
  };

  const handleCreateOrUpdate = async () => {
    try {
      const payload = {
        ...newItem,
        category: newItem.category === 'Other' ? otherCategory : newItem.category,
        available_times: newItem.available_times.join(', '),
      };
      if (!payload.name.trim()) return alert('Name is required');
      if (editingId) {
        await orgadminApi.updateMenuItem(editingId, payload);
      } else {
        await orgadminApi.createMenuItem(payload, selectedImages); // Pass images here!
      }
      setNewItem(defaultItem);
      setOtherCategory('');
      setEditingId(null);
      setSelectedImages([]); // Clear images after submit
      await fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewItem({
      ...item,
      available_times: item.available_times.split(',').map((s) => s.trim()),
    });
    if (!categories.includes(item.category)) {
      setNewItem((prev) => ({ ...prev, category: 'Other' }));
      setOtherCategory(item.category);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await orgadminApi.deleteMenuItem(id);
      await fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return alert('Please select a file first.');
    try {
      await orgadminApi.bulkImportMenuItems(bulkFile);
      setBulkFile(null);
      await fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'available_times') {
      setNewItem((prev) => {
        const updated = checked
          ? [...prev.available_times, value]
          : prev.available_times.filter((t) => t !== value);
        return { ...prev, available_times: updated };
      });
    } else if (name === 'is_available') {
      setNewItem((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Calculate max price for price range slider
  const maxPrice = Math.max(...items.map(item => item.price), 1000);

  return (
    <div className="min-h-screen bg-blue-900 text-blue-50 p-4 md:p-8">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          layout
          className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-4xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Menu Items
          </h2>
          <p className="text-sm text-blue-900 mt-2">Manage your restaurant's menu items here.</p>
        </motion.div>

        {/* Add/Edit Menu Item Section */}
        <motion.div
          layout
          className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            {editingId ? (
              <>
                <PencilIcon className="h-6 w-6 text-blue-600" />
                Edit Item
              </>
            ) : (
              <>
                <PlusIcon className="h-6 w-6 text-green-600" />
                Add New Item
              </>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <input
              name="name"
              placeholder="Name (required)"
              className="input-field bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={newItem.name}
              onChange={handleChange}
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                name="price"
                type="number"
                placeholder="Price"
                className="input-field pl-8 bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                value={newItem.price}
                onChange={handleChange}
              />
            </div>
            <select
              name="category"
              value={newItem.category}
              onChange={handleChange}
              className="input-field bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {newItem.category === 'Other' && (
              <input
                placeholder="Custom Category"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                className="input-field bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            )}
            {/* Dietary Preference */}
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <input
                  type="radio"
                  name="dietary_preference"
                  value="Veg"
                  checked={newItem.dietary_preference === 'Veg'}
                  onChange={handleChange}
                  className="form-radio text-green-500"
                />
                Veg
              </label>
              <label className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 text-red-500" />
                <input
                  type="radio"
                  name="dietary_preference"
                  value="Non-Veg"
                  checked={newItem.dietary_preference === 'Non-Veg'}
                  onChange={handleChange}
                  className="form-radio text-red-500"
                />
                Non-Veg
              </label>
              <label className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <input
                  type="radio"
                  name="dietary_preference"
                  value="Contains Egg"
                  checked={newItem.dietary_preference === 'Contains Egg'}
                  onChange={handleChange}
                  className="form-radio text-yellow-500"
                />
                Contains Egg
              </label>
            </div>
            {/* Available Times */}
            <div className="flex gap-4 flex-wrap">
              {['Breakfast', 'Lunch', 'Dinner', 'All Times'].map((time) => (
                <label
                  key={time}
                  className="flex items-center gap-2 text-sm text-blue-900"
                >
                  <input
                    type="checkbox"
                    name="available_times"
                    value={time}
                    checked={newItem.available_times.includes(time)}
                    onChange={handleChange}
                    className="form-checkbox text-indigo-600"
                  />
                  {time}
                </label>
              ))}
            </div>
            {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-blue-900">Images (up to 4)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  id="menu-image-upload"
                  onChange={e => {
                    const files = Array.from(e.target.files).slice(0, 4);
                    setSelectedImages(files);
                    // If you want to store URLs in newItem.img_url as comma-separated:
                    setNewItem(prev => ({
                      ...prev,
                      img_url: '', // Clear the text input if using uploads
                    }));
                  }}
                />
                <button
                  type="button"
                  className="bg-blue-900 hover:bg-blue-950 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
                  onClick={() => document.getElementById('menu-image-upload').click()}
                >
                  Add Images
                </button>
                {/* Preview selected images */}
                {selectedImages.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {selectedImages.map((file, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {/* Fallback: manual URL input */}
                <input
                  name="img_url"
                  placeholder="Image URL (optional)"
                  className="input-field bg-gray-50 text-blue-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 mt-2"
                  value={newItem.img_url}
                  onChange={handleChange}
                  disabled={selectedImages.length > 0}
                />
              </div>
            {/* Availability Checkbox */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_available"
                checked={newItem.is_available}
                onChange={handleChange}
                className="form-checkbox bg-blue-900"
              />
              Available?
            </label>
          </div>
          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-blue-900 hover:bg-blue-950 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
              onClick={handleCreateOrUpdate}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-blue-900 font-medium px-6 py-3 rounded-lg transition duration-300"
                onClick={() => {
                  setNewItem(defaultItem);
                  setEditingId(null);
                  setOtherCategory('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>

        {/* Bulk Upload Section */}
        <motion.div
          layout
          className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <UploadIcon className="h-6 w-6 text-green-600" />
            Bulk Import
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="file"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-blue-900"
              onChange={(e) => setBulkFile(e.target.files[0])}
            />
          </div>
          <button
            className="bg-blue-900 hover:bg-blue-950 text-white font-medium px-6 py-3 rounded-lg transition duration-300"
            onClick={handleBulkUpload}
          >
            Upload
          </button>
        </motion.div>

        {/* Current Menu Section */}
        <motion.div
          layout
          className="bg-gray-50 text-blue-900 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Current Menu
            </h3>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search menu items..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 p-4 rounded-lg mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Dietary Preference Filter */}
                <div>
                  <h4 className="font-medium mb-2">Dietary Preference</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dietaryFilter"
                        value="all"
                        checked={dietaryFilter === 'all'}
                        onChange={() => setDietaryFilter('all')}
                        className="form-radio text-blue-600"
                      />
                      All
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dietaryFilter"
                        value="Veg"
                        checked={dietaryFilter === 'Veg'}
                        onChange={() => setDietaryFilter('Veg')}
                        className="form-radio text-green-600"
                      />
                      Veg
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dietaryFilter"
                        value="Non-Veg"
                        checked={dietaryFilter === 'Non-Veg'}
                        onChange={() => setDietaryFilter('Non-Veg')}
                        className="form-radio text-red-600"
                      />
                      Non-Veg
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="dietaryFilter"
                        value="Contains Egg"
                        checked={dietaryFilter === 'Contains Egg'}
                        onChange={() => setDietaryFilter('Contains Egg')}
                        className="form-radio text-yellow-600"
                      />
                      Contains Egg
                    </label>
                  </div>
                </div>

                {/* Available Times Filter */}
                <div>
                  <h4 className="font-medium mb-2">Available Times</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="timeFilter"
                        value="all"
                        checked={timeFilter === 'all'}
                        onChange={() => setTimeFilter('all')}
                        className="form-radio text-blue-600"
                      />
                      All Times
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="timeFilter"
                        value="Breakfast"
                        checked={timeFilter === 'Breakfast'}
                        onChange={() => setTimeFilter('Breakfast')}
                        className="form-radio text-blue-600"
                      />
                      Breakfast
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="timeFilter"
                        value="Lunch"
                        checked={timeFilter === 'Lunch'}
                        onChange={() => setTimeFilter('Lunch')}
                        className="form-radio text-blue-600"
                      />
                      Lunch
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="timeFilter"
                        value="Dinner"
                        checked={timeFilter === 'Dinner'}
                        onChange={() => setTimeFilter('Dinner')}
                        className="form-radio text-blue-600"
                      />
                      Dinner
                    </label>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-medium mb-2">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full mb-2"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </div>

          {loading ? (
            <div className="text-center py-10">
              <motion.div
                className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 mx-auto mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              <p className="text-gray-600">Fetching those delicious items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-gray-500">No menu items match your filters.</p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 text-blue-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300 relative overflow-hidden"
                >
                  <h4 className="text-xl font-semibold">{item.name}</h4>
                  <p className="text-sm text-blue-900 mt-2">₹{item.price}</p>
                  <p className="text-sm text-blue-900 mt-1">Category: {item.category}</p>
                  <p className="text-sm text-blue-900 mt-1">Diet: {item.dietary_preference}</p>
                  <p className="text-sm text-blue-900 mt-1">Time: {item.available_times}</p>
                  <p className="text-sm text-blue-900 mt-1">
                    Status: {item.is_available ? 'Available' : 'Unavailable'}
                  </p>
                  {item.img_url && (
                    <img
                      src={item.img_url}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mt-4"
                    />
                  )}
                  <div className="absolute top-4 right-4 flex gap-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition duration-300 flex items-center gap-1"
                      onClick={() => handleEdit(item)}
                    >
                      <PencilIcon className="h-5 w-5" />
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-300 flex items-center gap-1"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MenuItems;