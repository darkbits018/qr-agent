// import React from 'react';
// import { useKitchen } from '../context/KitchenContext';

// export default function Dashboard() {
//   const { orders, loading } = useKitchen();

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <h2>Dashboard</h2>

//       {/* Orders Overview */}
//       <div>
//         <h3>Orders</h3>
//         {orders.length > 0 ? (
//           <ul>
//             {orders.map((order) => (
//               <li key={order.id}>
//                 Table: {order.table_number}, Status: {order.status}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No orders available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { useKitchen } from '../context/KitchenContext';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiLoader, FiCoffee, FiTruck, FiAlertCircle, FiPieChart, FiTrendingUp, FiUsers } from 'react-icons/fi';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom'; // Make sure to import Link

const statusConfig = {
  pending: { color: 'bg-yellow-500', icon: <FiClock className="text-white" />, label: 'Pending' },
  accepted: { color: 'bg-blue-500', icon: <FiCheckCircle className="text-white" />, label: 'Accepted' },
  preparing: { color: 'bg-orange-500', icon: <FiLoader className="text-white" />, label: 'Preparing' },
  ready: { color: 'bg-purple-500', icon: <FiCoffee className="text-white" />, label: 'Ready' },
  completed: { color: 'bg-green-500', icon: <FiTruck className="text-white" />, label: 'Completed' },
  cancelled: { color: 'bg-red-500', icon: <FiAlertCircle className="text-white" />, label: 'Cancelled' }
};

export default function Dashboard() {
  const { orders, loading } = useKitchen();
  
  // Calculate statistics
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <motion.h2 
              className="text-3xl font-bold text-gray-800"
              whileHover={{ scale: 1.02 }}
            >
              Kitchen Dashboard
            </motion.h2>
            
            {/* Add this button */}
            <Link to="/kitchen/orders">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md flex items-center space-x-2"
              >
                <span>View Current Orders</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 flex items-center"
            >
              <div className={`p-3 rounded-full ${statusConfig.pending.color} mr-4`}>
                <FiPieChart className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                <p className="text-2xl font-bold text-gray-800">
                  <CountUp end={totalOrders} duration={1} />
                </p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 flex items-center"
            >
              <div className={`p-3 rounded-full ${statusConfig.completed.color} mr-4`}>
                <FiTrendingUp className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-800">
                  ₹<CountUp end={revenue} duration={1} separator="," />
                </p>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 flex items-center"
            >
              <div className={`p-3 rounded-full bg-indigo-500 mr-4`}>
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Active Tables</h3>
                <p className="text-2xl font-bold text-gray-800">
                  <CountUp 
                    end={new Set(orders.map(order => order.table_number)).size} 
                    duration={1} 
                  />
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Status Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Orders by Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(statusConfig).map(([status, { color, icon, label }]) => (
                <motion.div
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-sm p-4 text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} mb-2 mx-auto`}>
                    {icon}
                  </div>
                  <h4 className="font-medium text-gray-700">{label}</h4>
                  <p className="text-2xl font-bold">
                    <CountUp end={statusCounts[status] || 0} duration={1} />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Removed the Recent Orders section completely */}
      </motion.div>
    </div>
  );
}