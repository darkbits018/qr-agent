// // src/roles/kitchen/pages/Inventory.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import InventoryTable from '../components/InventoryTable';

// const Inventory = () => {
//   const mockInventory = [
//     { id: 1, name: 'Tomato', quantity: '5 kg', status: 'in stock' },
//     { id: 2, name: 'Cheese', quantity: '2 kg', status: 'low stock' },
//   ];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="p-6 bg-[#F5F7FA] min-h-screen"
//     >
//       <h1 className="text-2xl font-bold text-[#FF6F61] mb-6">Inventory</h1>
//       <InventoryTable inventory={mockInventory} onEdit={() => {}} onDelete={() => {}} />
//     </motion.div>
//   );
// };

// export default Inventory;

import React from 'react';

export default function Inventory() {
  return (
    <div>
      <h2>Inventory</h2>
      <p>Inventory management is not supported by the backend.</p>
    </div>
  );
}