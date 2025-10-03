// // import React, { useEffect, useState } from 'react';
// // import { motion } from 'framer-motion';
// // import AdminTable from '../components/AdminTable';
// // import LoadingSpinner from '../../../shared/utils/LoadingSpinner';
// // import { superadminApi } from '../api/superadminApi';

// // const Admins = () => {
// //   const [admins, setAdmins] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   // Fetch admins from the API
// //   useEffect(() => {
// //     const fetchAdmins = async () => {
// //       try {
// //         console.log('Fetching admins...');
// //         const fetchedAdmins = await superadminApi.listAdmins();
// //         console.log('Fetched admins:', fetchedAdmins);
// //         setAdmins(fetchedAdmins);
// //       } catch (err) {
// //         console.error('Error fetching admins:', err);
// //         setError(err.message || 'Failed to fetch admins.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchAdmins();
// //   }, []);

// //   // Handle admin edit
// //   const handleEdit = (admin) => {
// //     console.log('Editing admin:', admin);
// //     // Add logic to navigate to an edit page or open a modal
// //   };

// //   // Handle admin deletion
// //   const handleDelete = async (id) => {
// //     if (!window.confirm('Are you sure you want to delete this admin?')) return;

// //     try {
// //       console.log('Deleting admin with ID:', id);
// //       await superadminApi.deleteAdmin(id); // Assuming this method exists in your API
// //       setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
// //       console.log('Admin deleted successfully.');
// //     } catch (err) {
// //       console.error('Error deleting admin:', err);
// //       setError(err.message || 'Failed to delete admin.');
// //     }
// //   };

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0 }}
// //       animate={{ opacity: 1 }}
// //       exit={{ opacity: 0 }}
// //       className="p-6 bg-[#F5F7FA] min-h-screen"
// //     >
// //       {/* Header */}
// //       <h1 className="text-2xl font-bold text-[#1A365D] mb-6">Admins</h1>

// //       {/* Loading State */}
// //       {loading && (
// //         <div className="flex items-center justify-center h-64">
// //           <LoadingSpinner />
// //         </div>
// //       )}

// //       {/* Error State */}
// //       {error && <p className="text-red-500 text-center">{error}</p>}

// //       {/* Admin Table */}
// //       {!loading && !error && (
// //         <AdminTable
// //           admins={admins}
// //           onEdit={handleEdit}
// //           onDelete={handleDelete}
// //         />
// //       )}
// //     </motion.div>
// //   );
// // };

// // export default Admins;
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import AdminTable from '../components/AdminTable';
// import LoadingSpinner from '../../../shared/utils/LoadingSpinner';
// import { superadminApi } from '../api/superadminApi';

// const Admins = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       try {
//         console.log('Fetching admins...');
//         const fetchedAdmins = await superadminApi.listAdmins();
//         console.log('Fetched admins:', fetchedAdmins);
//         setAdmins(fetchedAdmins);
//       } catch (err) {
//         console.error('Error fetching admins:', err);
//         setError(err.message || 'Failed to fetch admins.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAdmins();
//   }, []);

//   const handleEdit = (admin) => {
//     console.log('Editing admin:', admin);
//     // Navigate to edit page or open modal
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this admin?')) return;

//     try {
//       console.log('Deleting admin with ID:', id);
//       await superadminApi.deleteAdmin(id);
//       setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
//       console.log('Admin deleted successfully.');
//     } catch (err) {
//       console.error('Error deleting admin:', err);
//       setError(err.message || 'Failed to delete admin.');
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="min-h-screen bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-semibold text-gray-800">Admins</h1>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex items-center justify-center h-64">
//           <LoadingSpinner />
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="text-center text-red-500 font-medium">
//           {error}
//         </div>
//       )}

//       {/* Admin Table */}
//       {!loading && !error && (
//         <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
//           <AdminTable
//             admins={admins}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default Admins;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import AdminTable from '../components/AdminTable';
import LoadingSpinner from '../../../shared/utils/LoadingSpinner';
import { superadminApi } from '../api/superadminApi';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        console.log('Fetching admins...');
        const fetchedAdmins = await superadminApi.listAdmins();
        console.log('Fetched admins:', fetchedAdmins);
        setAdmins(fetchedAdmins);
      } catch (err) {
        console.error('Error fetching admins:', err);
        setError(err.message || 'Failed to fetch admins.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleEdit = (admin) => {
    console.log('Editing admin:', admin);
    // Add logic to navigate to an edit page or open a modal
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      console.log('Deleting admin with ID:', id);
      await superadminApi.deleteAdmin(id);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      console.log('Admin deleted successfully.');
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError(err.message || 'Failed to delete admin.');
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen bg-gradient-to-br from-teal-50 to-teal-100"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-teal-800 flex items-center gap-3">
            <FiUsers className="text-teal-600" />
            Admins
          </h1>
          <p className="text-teal-600 mt-2">Manage your system administrators</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          {/* Optional Search Input (you can uncomment if needed) */}
          {/* 
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-teal-500" />
            </div>
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-beige-50 border border-beige-200 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 w-full sm:w-64 transition-all"
            />
          </motion.div>
          */}
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

      {/* Admin Table */}
      {!loading && !error && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-beige-50 rounded-xl shadow-sm border border-beige-200 overflow-hidden"
        >
          <AdminTable
            admins={filteredAdmins}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Admins;
