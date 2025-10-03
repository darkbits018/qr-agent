import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import OrgTable from '../components/OrgTable';
import { superadminApi } from '../api/superadminApi';
import LoadingSpinner from '../../../shared/utils/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch organizations from the API
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        console.log('Fetching organizations...');
        const orgs = await superadminApi.listOrganizations();
        console.log('Fetched organizations:', orgs);
        setOrganizations(orgs);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError(err.message || 'Failed to fetch organizations.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  // Handle organization edit
  const handleEdit = (org) => {
    console.log('Editing organization:', org);
    // Add logic to navigate to an edit page or open a modal
  };

  // Handle organization deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) return;

    try {
      console.log('Deleting organization with ID:', id);
      await superadminApi.deleteOrganization(id);
      setOrganizations((prevOrgs) => prevOrgs.filter((org) => org.id !== id));
      console.log('Organization deleted successfully.');
    } catch (err) {
      console.error('Error deleting organization:', err);
      setError(err.message || 'Failed to delete organization.');
    }
  };

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-teal-100"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-teal-800 flex items-center gap-3">
            <FaBuilding className="text-teal-600" />
            Organizations
          </h1>
          <p className="text-teal-600 mt-2">Manage all registered organizations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Search Input */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-teal-500" />
            </div>
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-beige-50 border border-beige-200 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 w-full sm:w-64 transition-all"
            />
          </motion.div>
          
          {/* Add Organization Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/superadmin/create-org')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 text-beige-50 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <FiPlus />
            Add Organization
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-64 bg-beige-50 rounded-xl shadow-sm border border-beige-200"
        >
          <LoadingSpinner className="text-teal-600" size="lg" />
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 mb-6 bg-red-50 border-l-4 border-red-400 rounded-r"
        >
          <p className="text-red-700 flex items-center gap-2">
            <FiUsers />
            {error}
          </p>
        </motion.div>
      )}

      {/* Organization Table */}
      {!loading && !error && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-beige-50 rounded-xl shadow-sm border border-beige-200 overflow-hidden"
        >
          <OrgTable
            organizations={filteredOrganizations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Organizations;