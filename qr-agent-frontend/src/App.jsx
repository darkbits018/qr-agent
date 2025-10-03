import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Lazy load pages for better initial load performance
const WelcomePage = React.lazy(() => import('./roles/customer/pages/WelcomePage'));
const OrderModePage = React.lazy(() => import('./roles/customer/pages/OrderModePage'));
const ChatPage = React.lazy(() => import('./roles/customer/pages/ChatPage'));
const MenuPage = React.lazy(() => import('./roles/customer/pages/MenuPage'));
const PaymentPage = React.lazy(() => import('./roles/customer/pages/PaymentPage'));
const NotFoundPage = React.lazy(() => import('./roles/customer/pages/NotFoundPage'));

// Role-specific routers
const CustomerRouter = React.lazy(() => import('./roles/customer/router'));
const KitchenRouter = React.lazy(() => import('./roles/kitchen/router'));
const OrgAdminRouter = React.lazy(() => import('./roles/orgadmin/router'));
const SuperAdminRouter = React.lazy(() => import('./roles/superadmin/router'));

// Context Providers
import { CartProvider } from './roles/customer/context/CartContext';
import { ChatProvider } from './roles/customer/context/ChatContext';
import { UserProvider } from './roles/customer/context/UserContext';

// Preload component
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#F5F7FA] to-[#EEF1F4] flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 bg-[#4C4C9D] rounded-full animate-pulse mb-4"></div>
      <p className="text-[#7A7F87] text-sm">Loading experience...</p>
    </div>
  </div>
);

// Role Selection Page
const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    switch (role) {
      case 'superadmin':
        navigate('/superadmin/dashboard');
        break;
      case 'orgadmin':
        navigate('/orgadmin/dashboard');
        break;
      case 'kitchen':
        navigate('/kitchen/dashboard');
        break;
      case 'customer':
        navigate('/customer/welcome');
        break;
      default:
        console.error('Invalid role selected');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to QR Agent</h1>
      <p className="text-lg mb-8">Please select your role:</p>
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => handleRoleSelection('superadmin')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Super Admin
        </button>
        <button
          onClick={() => handleRoleSelection('orgadmin')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-green-600 transition-colors"
        >
          Organization Admin
        </button>
        <button
          onClick={() => handleRoleSelection('kitchen')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-yellow-600 transition-colors"
        >
          Kitchen Staff
        </button>
        <button
          onClick={() => handleRoleSelection('customer')}
          className="btn-primary w-full py-3 rounded-md shadow-md hover:bg-purple-600 transition-colors"
        >
          Customer
        </button>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  // Preload critical assets
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload fonts
        const fontUrls = [
          '/assets/fonts/SpaceGrotesk-Variable.woff2',
          '/assets/fonts/Inter-Variable.woff2',
          '/assets/fonts/JetBrainsMono-Variable.woff2'
        ];

        await Promise.all(
          fontUrls.map((url) =>
            new Promise((resolve, reject) => {
              const link = document.createElement('link');
              link.href = url;
              link.rel = 'preload';
              link.as = 'font';
              link.type = 'font/woff2';
              link.crossOrigin = 'anonymous';
              link.onload = resolve;
              link.onerror = reject;
              document.head.appendChild(link);
            })
          )
        );

        // Preload critical images (if any)
        // Add any critical images here

        setAssetsPreloaded(true);
      } catch (error) {
        console.error('Error preloading assets:', error);
        // Continue anyway to ensure app loads
        setAssetsPreloaded(true);
      }
    };

    preloadAssets();
  }, []);

  // Handle table ID from QR code
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableId = params.get('table_id');

    if (tableId) {
      sessionStorage.setItem('table_id', tableId);
    }

    // Simulate initial load and redirect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  if (isLoading || !assetsPreloaded) {
    return <PageLoader />;
  }

  return (
    <UserProvider>
      <CartProvider>
        <ChatProvider>
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                {/* Role Selection Page */}
                <Route path="/" element={<RoleSelectionPage />} />

                {/* Customer Routes */}
                <Route
                  path="/customer/*"
                  element={
                    <CustomerRouter />
                  }
                />

                {/* Kitchen Routes */}
                <Route
                  path="/kitchen/*"
                  element={
                    <KitchenRouter />
                  }
                />

                {/* OrgAdmin Routes */}
                <Route
                  path="/orgadmin/*"
                  element={
                    <OrgAdminRouter />
                  }
                />

                {/* SuperAdmin Routes */}
                <Route
                  path="/superadmin/*"
                  element={
                    <SuperAdminRouter />
                  }
                />

                {/* Fallback Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </ChatProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;