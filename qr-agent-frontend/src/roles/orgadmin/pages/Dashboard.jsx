// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Bar, Pie, Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { motion } from 'framer-motion';
// import { FiClock, FiDollarSign, FiPieChart, FiCoffee, FiUsers, FiHome } from 'react-icons/fi';
// Chart.register(...registerables);

// const Dashboard = () => {
//   // Mock data states
//   const [menuItemsData, setMenuItemsData] = useState([]);
//   const [tablesData, setTablesData] = useState([]);
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Generate mock data
//   useEffect(() => {
//     const generateMockData = () => {
//       const mockMenuItems = [
//         { id: 1, name: 'Margherita Pizza', quantity: 42, category: 'Pizza' },
//         { id: 2, name: 'Pepperoni Pizza', quantity: 38, category: 'Pizza' },
//         { id: 3, name: 'Caesar Salad', quantity: 28, category: 'Salad' },
//         { id: 4, name: 'Garlic Bread', quantity: 56, category: 'Appetizer' },
//         { id: 5, name: 'Tiramisu', quantity: 22, category: 'Dessert' },
//         { id: 6, name: 'Red Wine', quantity: 18, category: 'Drink' },
//       ];
//       const mockTables = Array.from({ length: 12 }, (_, i) => {
//         const isOccupied = Math.random() > 0.5;

//         return {
//           id: i + 1,
//           status: isOccupied ? 'occupied' : 'empty',
//           occupiedSince: isOccupied
//             ? new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString()
//             : null,
//           billAmount: isOccupied
//             ? (Math.random() * 200 + 20).toFixed(2)
//             : null,
//         };
//       });
//       const mockSales = [
//         { day: 'Mon', amount: 1240 },
//         { day: 'Tue', amount: 1890 },
//         { day: 'Wed', amount: 1420 },
//         { day: 'Thu', amount: 2100 },
//         { day: 'Fri', amount: 3200 },
//         { day: 'Sat', amount: 4150 },
//         { day: 'Sun', amount: 3800 },
//       ];
//       setMenuItemsData(mockMenuItems);
//       setTablesData(mockTables);
//       setSalesData(mockSales);
//       setLoading(false);
//     };
//     setTimeout(generateMockData, 1000);
//   }, []);

//   // Chart data configurations
//   const menuChartData = {
//     labels: menuItemsData.map(item => item.name),
//     datasets: [
//       {
//         label: 'Quantity Sold',
//         data: menuItemsData.map(item => item.quantity),
//         backgroundColor: [
//           'rgba(99, 102, 241, 0.7)', // Dark Blue
//           'rgba(255, 243, 224, 0.7)', // Beige
//           'rgba(59, 130, 246, 0.7)', // Light Blue
//           'rgba(16, 185, 129, 0.7)', // Green
//           'rgba(245, 158, 11, 0.7)', // Yellow
//           'rgba(239, 68, 68, 0.7)', // Red
//         ],
//         borderColor: [
//           'rgba(99, 102, 241, 1)',
//           'rgba(255, 243, 224, 1)',
//           'rgba(59, 130, 246, 1)',
//           'rgba(16, 185, 129, 1)',
//           'rgba(245, 158, 11, 1)',
//           'rgba(239, 68, 68, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const tablesChartData = {
//     labels: ['Occupied', 'Empty'],
//     datasets: [
//       {
//         data: [
//           tablesData.filter(table => table.status === 'occupied').length,
//           tablesData.filter(table => table.status === 'empty').length,
//         ],
//         backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(255, 243, 224, 0.7)'], // Red and Beige
//         borderColor: ['rgba(239, 68, 68, 1)', 'rgba(255, 243, 224, 1)'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const salesChartData = {
//     labels: salesData.map(item => item.day),
//     datasets: [
//       {
//         label: 'Daily Sales (₹)',
//         data: salesData.map(item => item.amount),
//         fill: false,
//         backgroundColor: 'rgba(99, 102, 241, 0.7)', // Dark Blue
//         borderColor: 'rgba(99, 102, 241, 1)',
//         tension: 0.4,
//       },
//     ],
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-blue-900 text-blue-50 p-4 md:p-8">
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//         className="max-w-7xl mx-auto"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
//                 Restaurant Command Center
//               </h1>
//               <p className="text-blue-200 mt-2">
//                 Real-time analytics and management at your fingertips
//               </p>
//             </div>
//             <div className="flex space-x-4">
//               <Link
//                 to="/orgadmin/kitchen"
//                 className="flex items-center px-6 py-3 bg-gray-50 text-blue-900 hover:bg-gray-200 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
//               >
//                 <FiCoffee className="mr-2" />
//                 Kitchen View
//               </Link>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Cards */}
//         <motion.div
//           variants={itemVariants}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//         >
//           <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-gray-200 mr-4">
//                 <FiUsers className="text-blue-900 text-xl" />
//               </div>
//               <div>
//                 <p className="text-blue-900 text-sm">Occupied Tables</p>
//                 <h3 className="text-2xl font-bold">
//                   {tablesData.filter(table => table.status === 'occupied').length}
//                 </h3>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-gray-200 mr-4">
//                 <FiHome className="text-blue-900 text-xl" />
//               </div>
//               <div>
//                 <p className="text-blue-900 text-sm">Available Tables</p>
//                 <h3 className="text-2xl font-bold">
//                   {tablesData.filter(table => table.status === 'empty').length}
//                 </h3>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-gray-200 mr-4">
//                 <FiClock className="text-blue-900 text-xl" />
//               </div>
//               <div>
//                 <p className="text-blue-900 text-sm">Avg. Occupancy</p>
//                 <h3 className="text-2xl font-bold">42 min</h3>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-gray-200 mr-4">
//                 <span className="text-blue-900 text-xl font-bold">₹</span>
//               </div>
//               <div>
//                 <p className="text-blue-900 text-sm">Today's Revenue</p>
//                 <h3 className="text-2xl font-bold">₹3,842</h3>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           {/* Menu Items Chart */}
//           <motion.div
//             variants={itemVariants}
//             className="lg:col-span-2 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-blue-900 flex items-center">
//                 <FiPieChart className="mr-2" /> Menu Item Performance
//               </h2>
//               <select className="bg-gray-200 border border-gray-300 rounded-md px-3 py-1 text-sm text-blue-900">
//                 <option>Today</option>
//                 <option>This Week</option>
//                 <option>This Month</option>
//               </select>
//             </div>
//             <div className="h-80">
//               {loading ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="animate-pulse text-blue-900">Loading data...</div>
//                 </div>
//               ) : (
//                 <Bar
//                   data={menuChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         position: 'top',
//                         labels: {
//                           color: '#0F172A',
//                         },
//                       },
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           color: '#0F172A',
//                         },
//                         grid: {
//                           color: 'rgba(200, 200, 200, 0.5)',
//                         },
//                       },
//                       x: {
//                         ticks: {
//                           color: '#0F172A',
//                         },
//                         grid: {
//                           color: 'rgba(200, 200, 200, 0.5)',
//                         },
//                       },
//                     },
//                   }}
//                 />
//               )}
//             </div>
//           </motion.div>

//           {/* Tables Status */}
//           <motion.div
//             variants={itemVariants}
//             className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
//           >
//             <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
//               <FiHome className="mr-2" /> Tables Status
//             </h2>
//             <div className="h-80">
//               {loading ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="animate-pulse text-blue-900">Loading data...</div>
//                 </div>
//               ) : (
//                 <Pie
//                   data={tablesChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         position: 'right',
//                         labels: {
//                           color: '#0F172A',
//                         },
//                       },
//                     },
//                   }}
//                 />
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Secondary Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Sales Trend */}
//           <motion.div
//             variants={itemVariants}
//             className="lg:col-span-2 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
//           >
//             <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
//               <FiDollarSign className="mr-2" /> Weekly Sales Trend
//             </h2>
//             <div className="h-64">
//               {loading ? (
//                 <div className="h-full flex items-center justify-center">
//                   <div className="animate-pulse text-blue-900">Loading data...</div>
//                 </div>
//               ) : (
//                 <Line
//                   data={salesChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: {
//                         labels: {
//                           color: '#0F172A',
//                         },
//                       },
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           color: '#0F172A',
//                         },
//                         grid: {
//                           color: 'rgba(200, 200, 200, 0.5)',
//                         },
//                       },
//                       x: {
//                         ticks: {
//                           color: '#0F172A',
//                         },
//                         grid: {
//                           color: 'rgba(200, 200, 200, 0.5)',
//                         },
//                       },
//                     },
//                   }}
//                 />
//               )}
//             </div>
//           </motion.div>

//           {/* Quick Actions */}
//           <motion.div
//             variants={itemVariants}
//             className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
//           >
//             <h2 className="text-xl font-semibold text-blue-900 mb-6">Quick Actions</h2>
//             <div className="space-y-4">
//               <Link
//                 to="/orgadmin/menu-items"
//                 className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                   <FiPieChart />
//                 </div>
//                 <div>
//                   <h3 className="font-medium">Manage Menu Items</h3>
//                   <p className="text-sm text-blue-900">Add, edit, or remove items</p>
//                 </div>
//               </Link>
//               <Link
//                 to="/orgadmin/tables"
//                 className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                   <FiHome />
//                 </div>
//                 <div>
//                   <h3 className="font-medium">Manage Tables</h3>
//                   <p className="text-sm text-blue-900">Configure restaurant layout</p>
//                 </div>
//               </Link>
//               <Link
//                 to="/orgadmin/kitchen"
//                 className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                   <FiCoffee />
//                 </div>
//                 <div>
//                   <h3 className="font-medium">Kitchen Display</h3>
//                   <p className="text-sm text-blue-900">View active orders</p>
//                 </div>
//               </Link>
//               <Link
//                 to="/orgadmin/staff"
//                 className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
//                   <FiUsers />
//                 </div>
//                 <div>
//                   <h3 className="font-medium">Create Staff</h3>
//                   <p className="text-sm text-blue-900">Create Staff Login Credentials</p>
//                 </div>
//               </Link>
//             </div>
//           </motion.div>
//         </div>

//         {/* Tables Details */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-8 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
//         >
//           <h2 className="text-xl font-semibold text-blue-900 mb-6">Tables Details</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
//                     Table #
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
//                     Occupied Since
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
//                     Current Bill
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-4 text-center text-blue-900">
//                       Loading table data...
//                     </td>
//                   </tr>
//                 ) : (
//                   tablesData.map((table) => (
//                     <tr key={table.id} className="hover:bg-gray-100 transition-colors duration-150">
//                       <td className="px-6 py-4 whitespace-nowrap text-blue-900">{table.id}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             table.status === 'occupied'
//                               ? 'bg-red-500/20 text-red-900'
//                               : 'bg-green-500/20 text-green-900'
//                           }`}
//                         >
//                           {table.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-blue-900">{table.occupiedSince || '-'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-blue-900">
//                         {table.billAmount ? `₹${table.billAmount}` : '-'}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';
import { FiClock, FiDollarSign, FiPieChart, FiCoffee, FiUsers, FiHome } from 'react-icons/fi';
Chart.register(...registerables);
const Dashboard = () => {
  // Mock data states
  const [menuItemsData, setMenuItemsData] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Generate mock data
  useEffect(() => {
    const generateMockData = () => {
      const mockMenuItems = [
        { id: 1, name: 'Margherita Pizza', quantity: 42, category: 'Pizza' },
        { id: 2, name: 'Pepperoni Pizza', quantity: 38, category: 'Pizza' },
        { id: 3, name: 'Caesar Salad', quantity: 28, category: 'Salad' },
        { id: 4, name: 'Garlic Bread', quantity: 56, category: 'Appetizer' },
        { id: 5, name: 'Tiramisu', quantity: 22, category: 'Dessert' },
        { id: 6, name: 'Red Wine', quantity: 18, category: 'Drink' },
      ];
      const mockTables = Array.from({ length: 12 }, (_, i) => {
        const isOccupied = Math.random() > 0.5;
        return {
          id: i + 1,
          status: isOccupied ? 'occupied' : 'empty',
          occupiedSince: isOccupied
            ? new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString()
            : null,
          billAmount: isOccupied
            ? (Math.random() * 200 + 20).toFixed(2)
            : null,
        };
      });
      const mockSales = [
        { day: 'Mon', amount: 1240 },
        { day: 'Tue', amount: 1890 },
        { day: 'Wed', amount: 1420 },
        { day: 'Thu', amount: 2100 },
        { day: 'Fri', amount: 3200 },
        { day: 'Sat', amount: 4150 },
        { day: 'Sun', amount: 3800 },
      ];
      setMenuItemsData(mockMenuItems);
      setTablesData(mockTables);
      setSalesData(mockSales);
      setLoading(false);
    };
    setTimeout(generateMockData, 1000);
  }, []);
  // Chart data configurations
  const menuChartData = {
    labels: menuItemsData.map(item => item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: menuItemsData.map(item => item.quantity),
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)', // Dark Blue
          'rgba(255, 243, 224, 0.7)', // Beige
          'rgba(59, 130, 246, 0.7)', // Light Blue
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(245, 158, 11, 0.7)', // Yellow
          'rgba(239, 68, 68, 0.7)', // Red
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(255, 243, 224, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const tablesChartData = {
    labels: ['Occupied', 'Empty'],
    datasets: [
      {
        data: [
          tablesData.filter(table => table.status === 'occupied').length,
          tablesData.filter(table => table.status === 'empty').length,
        ],
        backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(255, 243, 224, 0.7)'], // Red and Beige
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(255, 243, 224, 1)'],
        borderWidth: 1,
      },
    ],
  };
  const salesChartData = {
    labels: salesData.map(item => item.day),
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: salesData.map(item => item.amount),
        fill: false,
        backgroundColor: 'rgba(99, 102, 241, 0.7)', // Dark Blue
        borderColor: 'rgba(99, 102, 241, 1)',
        tension: 0.4,
      },
    ],
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  return (
    <div className="min-h-screen bg-blue-900 text-blue-50 p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                Restaurant Command Center
              </h1>
              <p className="text-blue-200 mt-2">
                Real-time analytics and management at your fingertips
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/orgadmin/kitchen"
                className="flex items-center px-6 py-3 bg-gray-50 text-blue-900 hover:bg-gray-200 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <FiCoffee className="mr-2" />
                Kitchen View
              </Link>
            </div>
          </div>
        </motion.div>
        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200 mr-4">
                <FiUsers className="text-blue-900 text-xl" />
              </div>
              <div>
                <p className="text-blue-900 text-sm">Occupied Tables</p>
                <h3 className="text-2xl font-bold">
                  {tablesData.filter(table => table.status === 'occupied').length}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200 mr-4">
                <FiHome className="text-blue-900 text-xl" />
              </div>
              <div>
                <p className="text-blue-900 text-sm">Available Tables</p>
                <h3 className="text-2xl font-bold">
                  {tablesData.filter(table => table.status === 'empty').length}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200 mr-4">
                <FiClock className="text-blue-900 text-xl" />
              </div>
              <div>
                <p className="text-blue-900 text-sm">Avg. Occupancy</p>
                <h3 className="text-2xl font-bold">42 min</h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 hover:border-gray-300/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200 mr-4">
                <span className="text-blue-900 text-xl font-bold">₹</span>
              </div>
              <div>
                <p className="text-blue-900 text-sm">Today's Revenue</p>
                <h3 className="text-2xl font-bold">₹3,842</h3>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Menu Items Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-900 flex items-center">
                <FiPieChart className="mr-2" /> Menu Item Performance
              </h2>
              <select className="bg-gray-200 border border-gray-300 rounded-md px-3 py-1 text-sm text-blue-900">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-blue-900">Loading data...</div>
                </div>
              ) : (
                <Bar
                  data={menuChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#0F172A',
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#0F172A',
                        },
                        grid: {
                          color: 'rgba(200, 200, 200, 0.5)',
                        },
                      },
                      x: {
                        ticks: {
                          color: '#0F172A',
                        },
                        grid: {
                          color: 'rgba(200, 200, 200, 0.5)',
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </motion.div>
          {/* Tables Status */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <FiHome className="mr-2" /> Tables Status
            </h2>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-blue-900">Loading data...</div>
                </div>
              ) : (
                <Pie
                  data={tablesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: '#0F172A',
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </motion.div>
        </div>
        {/* Secondary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Trend */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <FiDollarSign className="mr-2" /> Weekly Sales Trend
            </h2>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-blue-900">Loading data...</div>
                </div>
              ) : (
                <Line
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#0F172A',
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#0F172A',
                        },
                        grid: {
                          color: 'rgba(200, 200, 200, 0.5)',
                        },
                      },
                      x: {
                        ticks: {
                          color: '#0F172A',
                        },
                        grid: {
                          color: 'rgba(200, 200, 200, 0.5)',
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </motion.div>
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/orgadmin/menu-items"
                className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <FiPieChart />
                </div>
                <div>
                  <h3 className="font-medium">Manage Menu Items</h3>
                  <p className="text-sm text-blue-900">Add, edit, or remove items</p>
                </div>
              </Link>
              <Link
                to="/orgadmin/tables"
                className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <FiHome />
                </div>
                <div>
                  <h3 className="font-medium">Manage Tables</h3>
                  <p className="text-sm text-blue-900">Configure restaurant layout</p>
                </div>
              </Link>
              <Link
                to="/orgadmin/kitchen"
                className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <FiCoffee />
                </div>
                <div>
                  <h3 className="font-medium">Kitchen Display</h3>
                  <p className="text-sm text-blue-900">View active orders</p>
                </div>
              </Link>
              {/* Create Staff Link */}
              <Link
                to="/orgadmin/staff"
                className="block p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <FiUsers />
                </div>
                <div>
                  <h3 className="font-medium">Create Staff</h3>
                  <p className="text-sm text-blue-900">Create Staff Login Credentials</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Tables Details */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-gray-50 text-blue-900 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-gray-300/20 transition-all duration-300"
        >
          <h2 className="text-xl font-semibold text-blue-900 mb-6">Tables Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Table #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Occupied Since
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
                    Current Bill
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-blue-900">
                      Loading table data...
                    </td>
                  </tr>
                ) : (
                  tablesData.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-100 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-blue-900">{table.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            table.status === 'occupied'
                              ? 'bg-red-500/20 text-red-900'
                              : 'bg-green-500/20 text-green-900'
                          }`}
                        >
                          {table.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-900">{table.occupiedSince || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-900">
                        {table.billAmount ? `₹${table.billAmount}` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Dashboard;