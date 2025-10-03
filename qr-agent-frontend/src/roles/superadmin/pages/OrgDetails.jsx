// src/roles/superadmin/pages/OrgDetails.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const OrgDetails = () => {
  const { id } = useParams();
  const mockOrganization = {
    id: 1,
    name: 'Restaurant Chain A',
    status: 'active',
    locations: 25,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 bg-[#F5F7FA] min-h-screen"
    >
      <h1 className="text-2xl font-bold text-[#1A365D] mb-6">Organization Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[#1A365D] mb-2">{mockOrganization.name}</h3>
        <p className="text-gray-600">Status: {mockOrganization.status}</p>
        <p className="text-gray-600">Locations: {mockOrganization.locations}</p>
      </div>
    </motion.div>
  );
};

export default OrgDetails;