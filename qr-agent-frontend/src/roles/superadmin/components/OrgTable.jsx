// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Edit2, Trash2, ExternalLink } from 'lucide-react';

// function OrgTable({ organizations, onEdit, onDelete }) {
//   // Handle external link click
//   const handleExternalLinkClick = () => {
//     alert('There is no link associated with this organization.');
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="bg-white rounded-lg shadow-md overflow-hidden"
//       >
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Organization
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Locations
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {organizations.map((org) => (
//               <tr key={org.id} className="hover:bg-gray-50 transition-colors duration-200">
//                 {/* Organization Name */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-semibold text-gray-900">{org.name || 'Unknown'}</div>
//                 </td>

//                 {/* Status */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       org.status === 'active'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}
//                   >
//                     {org.status?.charAt(0).toUpperCase() + org.status?.slice(1) || 'N/A'}
//                   </span>
//                 </td>

//                 {/* Locations */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {org.locations || 'N/A'}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                   {/* External Link */}
//                   <button
//                     onClick={handleExternalLinkClick}
//                     className="text-[#1A365D] hover:text-[#122b4a] transition-colors duration-200"
//                   >
//                     <ExternalLink size={18} />
//                   </button>

//                   {/* Edit */}
//                   <button
//                     onClick={() => onEdit(org)}
//                     className="text-[#1A365D] hover:text-[#122b4a] transition-colors duration-200"
//                   >
//                     <Edit2 size={18} />
//                   </button>

//                   {/* Delete */}
//                   <button
//                     onClick={() => onDelete(org.id)}
//                     className="text-red-600 hover:text-red-700 transition-colors duration-200"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// export default OrgTable;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';

function OrgTable({ organizations, onEdit, onDelete }) {
  const handleExternalLinkClick = () => {
    alert('There is no link associated with this organization.');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-beige-50 rounded-xl border border-beige-200 shadow-sm overflow-hidden"
      >
        <table className="min-w-full text-sm text-left">
          <thead className="bg-beige-100 text-gray-600 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Locations</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige-300 bg-white">
            {organizations.map((org) => (
              <tr
                key={org.id}
                className="hover:bg-beige-50 transition-colors duration-200"
              >
                {/* Name */}
                <td className="px-6 py-4 font-medium text-gray-800">
                  {org.name || 'Unknown'}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      org.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {org.status?.charAt(0).toUpperCase() + org.status?.slice(1) || 'N/A'}
                  </span>
                </td>

                {/* Locations */}
                <td className="px-6 py-4 text-gray-600">
                  {org.locations || 'N/A'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-3">
                  {/* External Link */}
                  <button
                    onClick={handleExternalLinkClick}
                    className="text-blue-900 hover:text-blue-700 transition"
                  >
                    <ExternalLink size={18} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(org)}
                    className="text-blue-900 hover:text-blue-700 transition"
                  >
                    <Edit2 size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(org.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrgTable;
