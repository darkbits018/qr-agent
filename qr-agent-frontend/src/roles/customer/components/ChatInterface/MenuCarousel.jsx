// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const SkeletonCard = () => (
//   <div className="w-64 h-32 bg-[#f8f6ff] rounded-lg p-2 shadow-sm border border-[#ded7f3] animate-pulse flex-shrink-0 mr-4">
//     <div className="flex h-full">
//       <div className="w-24 h-full bg-gray-300 rounded skeleton mr-2" />
//       <div className="flex-1 flex flex-col">
//         <div className="flex justify-between">
//           <div className="w-3/5 h-3 bg-gray-300 rounded" />
//           <div className="w-1/4 h-3 bg-gray-300 rounded" />
//         </div>
//         <div className="w-full h-2.5 bg-gray-200 rounded mt-1.5" />
//         <div className="w-full h-6 bg-gray-300 rounded skeleton mt-auto" />
//       </div>
//     </div>
//   </div>
// );

// const AddOnPill = ({ name, price, isSelected, onClick }) => (
//   <motion.button
//     onClick={onClick}
//     className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 shadow-sm
//       ${isSelected
//         ? 'bg-gradient-to-r from-[#6a4cff] to-[#4d2c91] text-white border-[#4d2c91] scale-105'
//         : 'bg-white text-[#4d2c91] border-[#e6d9ff] hover:bg-[#f3f0ff] hover:scale-105'
//       }`}
//     whileTap={{ scale: 0.95 }}
//     whileHover={{ scale: 1.08 }}
//     style={{ marginBottom: 4, marginRight: 6, minWidth: 0 }}
//   >
//     <span className="truncate">{name}</span>
//     <span className="ml-1 text-[10px] font-semibold">+₹{price}</span>
//   </motion.button>
// );

// const MenuCarousel = ({
//   items = [],
//   title,
//   loading = false,
//   onUpdateQuantity = () => {},
//   onAddAddOn = () => {}
// }) => {
//   const [expandedItem, setExpandedItem] = useState(null);
//   const [selectedAddOns, setSelectedAddOns] = useState({});
//   const safeItems = Array.isArray(items) ? items : [];

//   const handleAddOnSelect = (itemId, addOn) => {
//     setSelectedAddOns(prev => {
//       const newSelection = { ...prev };
//       if (!newSelection[itemId]) newSelection[itemId] = [];
//       if (newSelection[itemId].includes(addOn.id)) {
//         newSelection[itemId] = newSelection[itemId].filter(id => id !== addOn.id);
//       } else {
//         newSelection[itemId] = [...newSelection[itemId], addOn.id];
//       }
//       onAddAddOn(itemId, newSelection[itemId]);
//       return newSelection;
//     });
//   };

//   const toggleItemExpand = (itemId) => {
//     setExpandedItem(prev => prev === itemId ? null : itemId);
//   };

//   // New: open add-ons when "+" is clicked
//   const handlePlusClick = (item) => {
//     onUpdateQuantity(item.id, 1);
//     if (item.addOns?.length > 0) setExpandedItem(item.id);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ type: 'spring', stiffness: 150 }}
//       className="w-full max-w-full mx-auto p-2 bg-[#fdfcff] border border-[#e0d8ff] rounded-lg shadow-inner"
//     >
//       {title && (
//         <h3 className="text-base font-semibold text-[#4d2c91] mb-2 px-1">{title}</h3>
//       )}

//       <div className="flex overflow-x-auto pb-3 gap-3 scrollbar-hide">
//         {loading ? (
//           Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
//         ) : safeItems.length === 0 ? (
//           <p className="text-xs text-gray-500 px-1">No items available 😶‍🌫️</p>
//         ) : (
//           safeItems.map((item) => (
//             <div key={item.id} className="flex-shrink-0" style={{ width: '280px' }}>
//               <motion.div
//                 className="flex flex-col bg-white border border-[#e6d9ff] rounded-lg shadow-xs p-2"
//                 whileHover={{ scale: 1.01 }}
//                 whileTap={{ scale: 0.98 }}
//                 style={{ minHeight: expandedItem === item.id ? '180px' : 'auto' }}
//               >
//                 <div className="flex">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
//                     style={{ aspectRatio: '1/1' }}
//                   />
//                   <div className="flex-1 min-w-0 ml-2">
//                     <div className="flex justify-between items-start">
//                       <h4 className="text-sm font-semibold text-[#3f2d70] truncate flex-1 mr-1">
//                         {item.name}
//                       </h4>
//                       <p className="text-xs font-bold text-[#2d174d] whitespace-nowrap">
//                         ₹{item.price}
//                       </p>
//                     </div>
//                     <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
//                       {item.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <button
//                         onClick={() => onUpdateQuantity(item.id, -1)}
//                         className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-xs font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
//                         disabled={item.quantity <= 1}
//                       >
//                         −
//                       </button>
//                       <span className="text-xs text-gray-700 w-6 text-center">
//                         {item.quantity || 1}
//                       </span>
//                       <button
//                         onClick={() => handlePlusClick(item)}
//                         className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-xs font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
//                         aria-label="Increase and show add-ons"
//                       >
//                         +
//                       </button>
//                       {item.addOns?.length > 0 && (
//                         <button
//                           onClick={() => toggleItemExpand(item.id)}
//                           className={`ml-2 px-2 py-1 rounded bg-[#e3dbf9] text-[#4d2c91] text-xs font-semibold hover:bg-[#d1c2f3] transition border border-[#d1c2f3] ${
//                             expandedItem === item.id ? 'ring-2 ring-[#4d2c91]' : ''
//                           }`}
//                         >
//                           {expandedItem === item.id ? 'Hide' : 'Add-ons'}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <AnimatePresence>
//                   {expandedItem === item.id && item.addOns?.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ type: 'spring', damping: 20 }}
//                       className="overflow-hidden mt-2"
//                     >
//                       <div className="pt-1 px-1">
//                         <p className="text-[11px] text-[#4d2c91] font-semibold mb-1">Add-ons:</p>
//                         <div className="flex flex-wrap gap-1">
//                           {item.addOns.map(addOn => (
//                             <AddOnPill
//                               key={addOn.id}
//                               name={addOn.name}
//                               price={addOn.price}
//                               isSelected={selectedAddOns[item.id]?.includes(addOn.id)}
//                               onClick={() => handleAddOnSelect(item.id, addOn)}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </div>
//           ))
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default MenuCarousel;-----------------------------------------------------------------------------------

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkeletonCard = () => (
  <div className="w-64 h-32 bg-[#f8f6ff] rounded-lg p-2 shadow-sm border border-[#ded7f3] animate-pulse flex-shrink-0 mr-4">
    <div className="flex h-full">
      <div className="w-24 h-full bg-gray-300 rounded skeleton mr-2" />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <div className="w-3/5 h-3 bg-gray-300 rounded" />
          <div className="w-1/4 h-3 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded mt-1.5" />
        <div className="w-full h-6 bg-gray-300 rounded skeleton mt-auto" />
      </div>
    </div>
  </div>
);

const AddOnPill = ({ name, price, isSelected, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 shadow-sm
      ${isSelected
        ? 'bg-gradient-to-r from-[#6a4cff] to-[#4d2c91] text-white border-[#4d2c91] scale-105'
        : 'bg-white text-[#4d2c91] border-[#e6d9ff] hover:bg-[#f3f0ff] hover:scale-105'
      }`}
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.08 }}
    style={{ marginBottom: 4, marginRight: 6, minWidth: 0 }}
  >
    <span className="truncate">{name}</span>
    <span className="ml-1 text-[10px] font-semibold">+₹{price}</span>
  </motion.button>
);

const MenuCarousel = ({
  items = [],
  title,
  loading = false,
  onUpdateQuantity = () => {},
  onAddAddOn = () => {}
}) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const carouselRef = useRef(null);
  const safeItems = Array.isArray(items) ? items : [];
  const useDualRow = safeItems.length > 5;
  
  // Split items into two rows if needed
  const topRow = useDualRow ? safeItems.slice(0, Math.ceil(safeItems.length / 2)) : [];
  const bottomRow = useDualRow ? safeItems.slice(Math.ceil(safeItems.length / 2)) : [];

  const handleAddOnSelect = (itemId, addOn) => {
    setSelectedAddOns(prev => {
      const newSelection = { ...prev };
      if (!newSelection[itemId]) newSelection[itemId] = [];
      if (newSelection[itemId].includes(addOn.id)) {
        newSelection[itemId] = newSelection[itemId].filter(id => id !== addOn.id);
      } else {
        newSelection[itemId] = [...newSelection[itemId], addOn.id];
      }
      onAddAddOn(itemId, newSelection[itemId]);
      return newSelection;
    });
  };

  const toggleItemExpand = (itemId) => {
    setExpandedItem(prev => prev === itemId ? null : itemId);
  };

  const handlePlusClick = (item) => {
    onUpdateQuantity(item.id, 1);
    if (item.addOns?.length > 0) setExpandedItem(item.id);
  };

  // Scroll both rows simultaneously
  const handleScroll = () => {
    if (!useDualRow || !carouselRef.current) return;
    const scrollPos = carouselRef.current.scrollLeft;
    const rows = carouselRef.current.querySelectorAll('.carousel-row');
    rows.forEach(row => {
      row.scrollLeft = scrollPos;
    });
  };

  // Render individual menu item card
  const renderItemCard = (item) => (
    <motion.div
      key={item.id}
      className="flex-shrink-0"
      style={{ width: '280px', marginBottom: useDualRow ? '12px' : 0 }}
    >
      <motion.div
        className="flex flex-col bg-white border border-[#e6d9ff] rounded-lg shadow-xs p-2"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{ minHeight: expandedItem === item.id ? '180px' : 'auto' }}
      >
        <div className="flex">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
            style={{ aspectRatio: '1/1' }}
          />
          <div className="flex-1 min-w-0 ml-2">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold text-[#3f2d70] truncate flex-1 mr-1">
                {item.name}
              </h4>
              <p className="text-xs font-bold text-[#2d174d] whitespace-nowrap">
                ₹{item.price}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
              {item.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-xs font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="text-xs text-gray-700 w-6 text-center">
                {item.quantity || 1}
              </span>
              <button
                onClick={() => handlePlusClick(item)}
                className="w-6 h-6 rounded-full bg-[#e3dbf9] text-[#4d2c91] text-xs font-bold flex items-center justify-center hover:bg-[#d1c2f3] transition"
                aria-label="Increase and show add-ons"
              >
                +
              </button>
              {item.addOns?.length > 0 && (
                <button
                  onClick={() => toggleItemExpand(item.id)}
                  className={`ml-2 px-2 py-1 rounded bg-[#e3dbf9] text-[#4d2c91] text-xs font-semibold hover:bg-[#d1c2f3] transition border border-[#d1c2f3] ${
                    expandedItem === item.id ? 'ring-2 ring-[#4d2c91]' : ''
                  }`}
                >
                  {expandedItem === item.id ? 'Hide' : 'Add-ons'}
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expandedItem === item.id && item.addOns?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="overflow-hidden mt-2"
            >
              <div className="pt-1 px-1">
                <p className="text-[11px] text-[#4d2c91] font-semibold mb-1">Add-ons:</p>
                <div className="flex flex-wrap gap-1">
                  {item.addOns.map(addOn => (
                    <AddOnPill
                      key={addOn.id}
                      name={addOn.name}
                      price={addOn.price}
                      isSelected={selectedAddOns[item.id]?.includes(addOn.id)}
                      onClick={() => handleAddOnSelect(item.id, addOn)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="w-full max-w-full mx-auto p-2 bg-[#fdfcff] border border-[#e0d8ff] rounded-lg shadow-inner"
    >
      {title && (
        <h3 className="text-base font-semibold text-[#4d2c91] mb-2 px-1">{title}</h3>
      )}

      <div 
        ref={carouselRef}
        className="overflow-x-auto pb-3 scrollbar-hide"
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="flex">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : safeItems.length === 0 ? (
          <p className="text-xs text-gray-500 px-1">No items available 😶‍🌫️</p>
        ) : useDualRow ? (
          <div className="flex flex-col">
            <div className="flex carousel-row pb-2" style={{ overflowX: 'visible' }}>
              {topRow.map(item => renderItemCard(item))}
            </div>
            <div className="flex carousel-row" style={{ overflowX: 'visible' }}>
              {bottomRow.map(item => renderItemCard(item))}
            </div>
          </div>
        ) : (
          <div className="flex">
            {safeItems.map(item => renderItemCard(item))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuCarousel;