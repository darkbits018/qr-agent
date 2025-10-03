// import React, { useRef, useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import MenuCard from './MenuCard';

// export default function MenuCarousel({ items, title, onAddToCart, onRemoveFromCart, cartItems }) {
//   const carouselRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   const scroll = (direction) => {
//     const container = carouselRef.current;
//     if (container) {
//       const scrollAmount = direction === 'left' ? -320 : 320;
//       container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const onMouseDown = (e) => {
//     setIsDragging(true);
//     setStartX(e.pageX - carouselRef.current.offsetLeft);
//     setScrollLeft(carouselRef.current.scrollLeft);
//   };

//   const onMouseLeave = () => {
//     setIsDragging(false);
//   };

//   const onMouseUp = () => {
//     setIsDragging(false);
//   };

//   const onMouseMove = (e) => {
//     if (!isDragging) return;
//     e.preventDefault();
//     const x = e.pageX - carouselRef.current.offsetLeft;
//     const walk = (x - startX) * 2;
//     carouselRef.current.scrollLeft = scrollLeft - walk;
//   };

//   return (
//     <div className="mb-8">
//       <div className="flex justify-between items-center mb-4 px-4">
//         <motion.h2 
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
//         >
//           {title}
//         </motion.h2>
//         <div className="flex gap-2">
//           <motion.button
//             whileHover={{ scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => scroll('left')}
//             className="p-2 rounded-full bg-white shadow-sm text-purple-700 hover:text-purple-600 transition-colors"
//             aria-label="Scroll left"
//           >
//             <ChevronLeft size={20} />
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => scroll('right')}
//             className="p-2 rounded-full bg-white shadow-sm text-purple-700 hover:text-purple-600 transition-colors"
//             aria-label="Scroll right"
//           >
//             <ChevronRight size={20} />
//           </motion.button>
//         </div>
//       </div>

//       <div
//         ref={carouselRef}
//         onMouseDown={onMouseDown}
//         onMouseLeave={onMouseLeave}
//         onMouseUp={onMouseUp}
//         onMouseMove={onMouseMove}
//         className="flex overflow-x-auto gap-6 px-6 pb-6 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
//         style={{ scrollSnapType: 'x mandatory' }}
//       >
//         <AnimatePresence>
//           {items.map((item) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//               style={{ scrollSnapAlign: 'start' }}
//               className="flex-shrink-0"
//             >
//               <MenuCard 
//                 item={item} 
//                 onAddToCart={onAddToCart}
//                 onRemoveFromCart={onRemoveFromCart}
//                 cartItems={cartItems}
//               />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuCard from './MenuCard';

export default function MenuCarousel({ items, title, onAddToCart, onRemoveFromCart, cartItems = [] }) {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white shadow-sm text-purple-700 hover:text-purple-600 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white shadow-sm text-purple-700 hover:text-purple-600 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
      <div
        ref={carouselRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex overflow-x-auto gap-6 px-6 pb-6 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ scrollSnapAlign: 'start' }}
              className="flex-shrink-0"
            >
              <MenuCard
                item={item}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                cartItems={cartItems}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}