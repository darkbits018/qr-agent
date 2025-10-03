
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Mail, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CreateAdminModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'org_admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Submitting form data:', formData);
      await onSubmit(formData);
      setSuccessMessage('Admin created successfully!');
      setTimeout(() => {
        onClose();
        navigate('/superadmin/admins');
      }, 1500);
    } catch (err) {
      console.error('Error during admin creation:', err);
      setError(err.message || 'Failed to create admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-teal-100 bg-opacity-70 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="fixed inset-y-0 right-0 max-w-md w-full bg-beige-50 shadow-xl z-50 border-l border-beige-200"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-6 border-b border-beige-200"
              >
                <div>
                  <h2 className="text-2xl font-bold text-teal-800">Create New Admin</h2>
                  <p className="text-sm text-teal-600">Add a new administrator to the system</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onClose();
                    navigate('/superadmin/dashboard');
                  }}
                  className="p-2 hover:bg-beige-100 rounded-full transition-all"
                >
                  <X size={20} className="text-teal-700" />
                </motion.button>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-teal-500" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 bg-beige-100 border border-beige-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 focus:bg-beige-50 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-teal-500" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 bg-beige-100 border border-beige-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 focus:bg-beige-50 transition-all"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Role Field */}
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-teal-700 mb-2">
                      Admin Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound size={18} className="text-teal-500" />
                      </div>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-10 pr-3 py-3 appearance-none bg-beige-100 border border-beige-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 focus:bg-beige-50 transition-all"
                      >
                        <option value="org_admin">Organization Admin</option>
                        <option value="kitchen_admin">Kitchen Admin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Status Messages */}
                <motion.div 
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {error && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r flex items-start gap-2">
                      <X size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-teal-50 border-l-4 border-teal-400 rounded-r flex items-start gap-2">
                      <CheckCircle size={18} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-teal-700">{successMessage}</p>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 text-beige-50 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Admin...
                      </>
                    ) : (
                      <>
                        <User size={18} />
                        Create Admin
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CreateAdminModal;