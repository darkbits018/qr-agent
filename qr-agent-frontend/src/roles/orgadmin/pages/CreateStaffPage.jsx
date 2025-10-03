import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Mail, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orgadminApi } from '../api/orgadminApi';

export default function CreateStaffPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Use the correct token key
      const token = localStorage.getItem('orgadmin_token1');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      // No need to check for organization_id!
      const response = await orgadminApi.createStaffMember(formData);
      setSuccessMessage(`Staff member ${response.email} added successfully!`);
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/orgadmin/staff');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add staff member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          Add New Staff Member
        </h2>
        {/* Status Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r flex items-start gap-2 mb-4"
            >
              <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700">{successMessage}</p>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r flex items-start gap-2 mb-4"
            >
              <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                placeholder="staff@example.com"
                required
              />
            </div>
          </div>
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Staff...
              </>
            ) : (
              <>Add Staff Member</>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}