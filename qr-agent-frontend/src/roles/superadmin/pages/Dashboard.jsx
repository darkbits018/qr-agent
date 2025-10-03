// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//   const navigate = useNavigate();

//   // Hardcoded mock data for the dashboard
//   const [dashboardData] = useState({
//     organizations: 10,
//     admins: 5,
//     activeOrganizations: 8,
//     pendingOrganizations: 2,
//     recentActivity: [
//       'Organization "Restaurant A" approved.',
//       'New admin "John Doe" created.',
//       'Organization "Food Court B" pending approval.',
//     ],
//   });

//   // Chart Data
//   const chartData = {
//     labels: ['Organizations', 'Admins', 'Active Orgs', 'Pending Orgs'],
//     datasets: [
//       {
//         label: 'Metrics',
//         data: [
//           dashboardData.organizations,
//           dashboardData.admins,
//           dashboardData.activeOrganizations,
//           dashboardData.pendingOrganizations,
//         ],
//         backgroundColor: ['#1A365D', '#4C4C9D', '#8B5CF6', '#F43F5E'],
//         borderColor: ['#122b4a', '#3730A3', '#6D28D9', '#E11D48'],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#e2e8f0',
//         },
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="p-6 bg-[#F5F7FA] min-h-screen"
//     >
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-[#1A365D] mb-6 text-center md:text-left">
//         SuperAdmin Dashboard
//       </h1>

//       {/* Key Metrics Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Organizations Card */}
//         <Card
//           title="Organizations"
//           value={dashboardData.organizations}
//           onClick={() => navigate('/superadmin/organizations')}
//         />

//         {/* Admins Card */}
//         <Card
//           title="Admins"
//           value={dashboardData.admins}
//           onClick={() => navigate('/superadmin/admins')}
//         />

//         {/* Active Organizations Card */}
//         <Card
//           title="Active Organizations"
//           value={dashboardData.activeOrganizations}
//           onClick={() => navigate('/superadmin/organizations')}
//         />

//         {/* Pending Organizations Card */}
//         <Card
//           title="Pending Organizations"
//           value={dashboardData.pendingOrganizations}
//           onClick={() => navigate('/superadmin/organizations')}
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold text-[#1A365D] mb-4">Metrics Overview</h2>
//         <div className="h-64">
//           <Bar data={chartData} options={chartOptions} />
//         </div>
//       </div>

//       {/* Quick Actions Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold text-[#1A365D] mb-4">Quick Actions</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Create Organization Button */}
//           <ActionButton
//             label="Create Organization"
//             onClick={() => navigate('/superadmin/create-org')}
//           />

//           {/* Create Admin Button */}
//           <ActionButton
//             label="Create Admin"
//             onClick={() => navigate('/superadmin/create-admin')}
//           />
//         </div>
//       </div>

//       {/* Recent Activity Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-[#1A365D] mb-4">Recent Activity</h2>
//         <ul className="space-y-2">
//           {dashboardData.recentActivity.map((activity, index) => (
//             <li key={index} className="text-gray-600">
//               {activity}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </motion.div>
//   );
// };

// // Reusable Card Component
// const Card = ({ title, value, onClick }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
//       onClick={onClick}
//     >
//       <h3 className="text-lg font-semibold text-[#1A365D] mb-2">{title}</h3>
//       <p className="text-gray-600">{value}</p>
//     </motion.div>
//   );
// };

// // Reusable Action Button Component
// const ActionButton = ({ label, onClick }) => {
//   return (
//     <button
//       className="flex items-center justify-center w-full md:w-auto py-2 px-4 bg-[#1A365D] text-white rounded-md hover:bg-[#122b4a] transition-colors"
//       onClick={onClick}
//     >
//       {label}
//     </button>
//   );
// };

// export default Dashboard;










import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiUsers, FiHome, FiCheckCircle, FiClock, FiPlus, FiActivity, FiZap, FiBell } from 'react-icons/fi';
import { FaRegBuilding } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  // Hardcoded mock data for the dashboard
  const [dashboardData] = useState({
    organizations: 10,
    admins: 5,
    activeOrganizations: 8,
    pendingOrganizations: 2,
    recentActivity: [
      { id: 1, message: 'Organization "Restaurant A" approved.', time: '2 mins ago' },
      { id: 2, message: 'New admin "John Doe" created.', time: '15 mins ago' },
      { id: 3, message: 'Organization "Food Court B" pending approval.', time: '1 hour ago' },
    ],
  });

  // Chart Data
  const chartData = {
    labels: ['Organizations', 'Admins', 'Active', 'Pending'],
    datasets: [
      {
        label: 'Metrics',
        data: [
          dashboardData.organizations,
          dashboardData.admins,
          dashboardData.activeOrganizations,
          dashboardData.pendingOrganizations,
        ],
        backgroundColor: ['#0E7C86', '#17B2BD', '#2DD4DF', '#45E6F2'],
        borderColor: ['#0A5D65', '#0E7C86', '#17B2BD', '#2DD4DF'],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#F5F0E6',
        titleColor: '#0E7C86',
        bodyColor: '#5E5E5E',
        borderColor: '#D1C7B7',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#5E5E5E',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(209, 199, 183, 0.3)',
        },
        ticks: {
          color: '#5E5E5E',
        }
      },
    },
  };

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
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Dashboard</h1>
          <p className="text-teal-600">Welcome back, SuperAdmin</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-teal-700 text-beige-50 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <FiBell className="text-beige-50" />
          <span>Notifications</span>
        </motion.button>
      </motion.div>

      {/* Key Metrics Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Organizations Card */}
        <MetricCard
          title="Organizations"
          value={dashboardData.organizations}
          icon={<FaRegBuilding className="text-2xl text-teal-700" />}
          onClick={() => navigate('/superadmin/organizations')}
          accentColor="bg-teal-600"
        />

        {/* Admins Card */}
        <MetricCard
          title="Admins"
          value={dashboardData.admins}
          icon={<FiUsers className="text-2xl text-teal-700" />}
          onClick={() => navigate('/superadmin/admins')}
          accentColor="bg-teal-500"
        />

        {/* Active Organizations Card */}
        <MetricCard
          title="Active"
          value={dashboardData.activeOrganizations}
          icon={<FiCheckCircle className="text-2xl text-teal-700" />}
          onClick={() => navigate('/superadmin/organizations')}
          accentColor="bg-teal-400"
        />

        {/* Pending Organizations Card */}
        <MetricCard
          title="Pending"
          value={dashboardData.pendingOrganizations}
          icon={<FiClock className="text-2xl text-teal-700" />}
          onClick={() => navigate('/superadmin/organizations')}
          accentColor="bg-teal-300"
        />
      </motion.div>

      {/* Charts and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts Section */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-beige-50 p-6 rounded-xl shadow-sm border border-beige-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-teal-800 flex items-center gap-2">
              <FiActivity className="text-teal-600" />
              Metrics Overview
            </h2>
            <select className="bg-beige-100 border border-beige-300 text-teal-800 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-beige-50 p-6 rounded-xl shadow-sm border border-beige-200 hover:shadow-md transition-all"
        >
          <h2 className="text-xl font-semibold text-teal-800 flex items-center gap-2 mb-6">
            <FiBell className="text-teal-600" />
            Recent Activity
          </h2>
          <ul className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <motion.li 
                key={activity.id}
                whileHover={{ x: 5 }}
                className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-teal-500 before:rounded-full"
              >
                <p className="text-gray-700">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Quick Actions Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-beige-50 p-6 rounded-xl shadow-sm border border-beige-200 hover:shadow-md transition-all"
      >
        <h2 className="text-xl font-semibold text-teal-800 flex items-center gap-2 mb-6">
          <FiZap className="text-teal-600" />
          Quick Actions
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Create Organization Button */}
          <ActionButton
            label="Create Organization"
            icon={<FiHome />}
            onClick={() => navigate('/superadmin/create-org')}
          />

          {/* Create Admin Button */}
          <ActionButton
            label="Create Admin"
            icon={<FiUsers />}
            onClick={() => navigate('/superadmin/create-admin')}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, onClick, accentColor }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative bg-beige-50 p-6 rounded-xl shadow-sm border border-beige-200 cursor-pointer group overflow-hidden transition-all hover:shadow-md`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-teal-700">{title}</p>
          <h3 className="text-2xl font-bold text-teal-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-beige-100 rounded-lg group-hover:bg-teal-50 transition-colors">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">View all {title.toLowerCase()}</p>
      </div>
    </motion.div>
  );
};

// Reusable Action Button Component
const ActionButton = ({ label, icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-teal-600 to-teal-500 text-beige-50 rounded-lg shadow-sm hover:shadow-md transition-all"
    >
      {React.cloneElement(icon, { className: "text-beige-50" })}
      <span>{label}</span>
    </motion.button>
  );
};

export default Dashboard;