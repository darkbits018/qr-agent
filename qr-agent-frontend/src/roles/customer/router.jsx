// src/roles/customer/router.jsx

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load Customer pages for better performance
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const OrderModePage = lazy(() => import('./pages/OrderModePage'));
const JoinGroupPage = lazy(() => import('./pages/JoinGroupPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Context Providers
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';
import { UserProvider } from './context/UserContext';

// Shared Components
import { AppShell } from './SharedComponents/AppShell';

// Preload component (fallback while loading)
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#F5F7FA] to-[#EEF1F4] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 bg-[#4C4C9D] rounded-full animate-pulse mb-4"></div>
      <p className="text-[#7A7F87] text-sm">Loading experience...</p>
    </div>
  </div>
);

export default function CustomerRouter() {
  return (
    <UserProvider>
      <CartProvider>
        <ChatProvider>
          <AppShell>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Welcome Page */}
                <Route path="/welcome" element={<WelcomePage />} />

                <Route path="/join" element={<JoinGroupPage />} />
                
                {/* Order Mode Page */}
                <Route path="/order-mode" element={<OrderModePage />} />

                {/* Chat Page */}
                <Route path="/chat" element={<ChatPage />} />

                {/* Menu Page */}
                <Route path="/menu" element={<MenuPage />} />
                
                {/* Payment Page */}
                <Route path="/payment" element={<PaymentPage />} />

                {/* Redirect root to /welcome */}
                <Route path="/" element={<Navigate to="/welcome" replace />} />

                {/* Fallback Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AppShell>
        </ChatProvider>
      </CartProvider>
    </UserProvider>
  );
}
