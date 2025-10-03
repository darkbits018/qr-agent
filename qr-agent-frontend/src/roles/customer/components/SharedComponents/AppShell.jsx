import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export function AppShell({ children }) {
  // Preload next possible routes
  useEffect(() => {
    const preloadRoutes = () => {
      // Preload all routes after initial render
      const routes = ['WelcomePage', 'ChatPage', 'MenuPage', 'PaymentPage'];
      routes.forEach(route => {
        const preloadRoute = () => {
          import(`../../pages/${route}.jsx`).catch(() => {
            // Silently fail - this is just preloading
          });
        };
        requestIdleCallback ? requestIdleCallback(preloadRoute) : setTimeout(preloadRoute, 1000);
      });
    };

    preloadRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#1A1A1A] overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto h-full min-h-screen relative"
      >
        {children}
      </motion.div>
    </div>
  );
}