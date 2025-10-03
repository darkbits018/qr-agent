// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext';
// // import Login from './pages/Login';
// // import Dashboard from './pages/Dashboard';
// // import Organizations from './pages/Organizations';
// // import Admins from './pages/Admins';
// // import OrgDetails from './pages/OrgDetails';

// // // Protected Route wrapper
// // function ProtectedRoute({ children }) {
// //   const token = localStorage.getItem('superadmin_token');
// //   if (!token) {
// //     return <Navigate to="/superadmin/login" replace />;
// //   }
// //   return children;
// // }

// // export default function SuperAdminRouter() {
// //   return (
// //     <SuperAdminAuthProvider>
// //       <Routes>
// //         <Route path="/login" element={<Login />} />
        
// //         <Route
// //           path="/dashboard"
// //           element={
// //             <ProtectedRoute>
// //               <Dashboard />
// //             </ProtectedRoute>
// //           }
// //         />
        
// //         <Route
// //           path="/organizations"
// //           element={
// //             <ProtectedRoute>
// //               <Organizations />
// //             </ProtectedRoute>
// //           }
// //         />
        
// //         <Route
// //           path="/organizations/:id"
// //           element={
// //             <ProtectedRoute>
// //               <OrgDetails />
// //             </ProtectedRoute>
// //           }
// //         />
        
// //         <Route
// //           path="/admins"
// //           element={
// //             <ProtectedRoute>
// //               <Admins />
// //             </ProtectedRoute>
// //           }
// //         />
        
// //         {/* Redirect /superadmin to dashboard if authenticated, login if not */}
// //         <Route
// //           path="/"
// //           element={
// //             localStorage.getItem('superadmin_token') ? (
// //               <Navigate to="/superadmin/dashboard" replace />
// //             ) : (
// //               <Navigate to="/superadmin/login" replace />
// //             )
// //           }
// //         />
// //       </Routes>
// //     </SuperAdminAuthProvider>
// //   );
// // }
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Organizations from './pages/Organizations';
// import OrgDetails from './pages/OrgDetails';
// import Admins from './pages/Admins';

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem('superadmin_token');
//   if (!token) {
//     return <Navigate to="/superadmin/login" replace />;
//   }
//   return children;
// }

// export default function SuperAdminRouter() {
//   return (
//     <SuperAdminAuthProvider>
//       <Routes>
//         {/* Login Page */}
//         <Route path="/login" element={<Login />} />

//         {/* Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Organizations */}
//         <Route
//           path="/organizations"
//           element={
//             <ProtectedRoute>
//               <Organizations />
//             </ProtectedRoute>
//           }
//         />

//         {/* Organization Details */}
//         <Route
//           path="/organizations/:id"
//           element={
//             <ProtectedRoute>
//               <OrgDetails />
//             </ProtectedRoute>
//           }
//         />

//         {/* Admins */}
//         <Route
//           path="/admins"
//           element={
//             <ProtectedRoute>
//               <Admins />
//             </ProtectedRoute>
//           }
//         />

//         {/* Redirect to Login or Dashboard */}
//         <Route
//           path="/"
//           element={
//             localStorage.getItem('superadmin_token') ? (
//               <Navigate to="/superadmin/dashboard" replace />
//             ) : (
//               <Navigate to="/superadmin/login" replace />
//             )
//           }
//         />
//       </Routes>
//     </SuperAdminAuthProvider>
//   );
// }
// src/roles/superadmin/router.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SuperAdminAuthProvider, useSuperAdminAuth } from './context/SuperAdminAuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import OrgDetails from './pages/OrgDetails';
import Admins from './pages/Admins';
import CreateOrgModal from './components/CreateOrgModal';
import CreateAdminModal from './components/CreateAdminModal';
import { useState, useEffect } from 'react';
import { superadminApi } from './api/superadminApi';

// Enhanced Protected Route with token validation
function ProtectedRoute({ children }) {
  const { isAuthenticated, user, loading, logout } = useSuperAdminAuth();
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateSession = async () => {
      try {
        setValidatingToken(true);
        const isValid = await superadminApi.validateToken();
        setTokenValid(isValid);
        
        if (!isValid) {
          // Token is invalid, clean up and logout
          console.warn('Session expired or invalid, redirecting to login');
          logout();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        logout();
      } finally {
        setValidatingToken(false);
      }
    };

    // If we have a token in storage but no user in context, validate the token
    const token = localStorage.getItem('superadmin_token');
    if (token && !isAuthenticated) {
      validateSession();
    } else if (isAuthenticated) {
      setTokenValid(true);
      setValidatingToken(false);
    } else {
      setTokenValid(false);
      setValidatingToken(false);
    }
  }, [isAuthenticated, logout, location.pathname]);

  // Show loading state while checking authentication
  if (loading || validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#1A365D] border-r-[#1A365D] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#1A365D] font-medium">Validating session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated or token is invalid
  if (!isAuthenticated || !tokenValid) {
    // Save the current location for potential redirect after login
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  // If all checks pass, render the protected content
  return children;
}

export default function SuperAdminRouter() {
  return (
    <SuperAdminAuthProvider>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Organizations */}
        <Route
          path="/organizations"
          element={
            <ProtectedRoute>
              <Organizations />
            </ProtectedRoute>
          }
        />

        {/* Organization Details */}
        <Route
          path="/organizations/:id"
          element={
            <ProtectedRoute>
              <OrgDetails />
            </ProtectedRoute>
          }
        />

        {/* Admins */}
        <Route
          path="/admins"
          element={
            <ProtectedRoute>
              <Admins />
            </ProtectedRoute>
          }
        />

        {/* Create Organization */}
        <Route
          path="/create-org"
          element={
            <ProtectedRoute>
              <CreateOrgModal isOpen={true} onClose={() => {}} onSubmit={() => {}} />
            </ProtectedRoute>
          }
        />

        {/* Create Admin */}
        <Route
          path="/create-admin"
          element={
            <ProtectedRoute>
              <CreateAdminModal isOpen={true} onClose={() => {}} onSubmit={() => {}} />
            </ProtectedRoute>
          }
        />

        {/* Redirect to Login or Dashboard */}
        <Route
          path="/"
          element={
            <AuthRedirect />
          }
        />
      </Routes>
    </SuperAdminAuthProvider>
  );
}

// Component to handle root path redirection
function AuthRedirect() {
  const { isAuthenticated, loading } = useSuperAdminAuth();
  const [checkingToken, setCheckingToken] = useState(true);
  
  useEffect(() => {
    const checkToken = async () => {
      try {
        // If we have a token but user context is not set, validate the token
        if (localStorage.getItem('superadmin_token') && !isAuthenticated) {
          const isValid = await superadminApi.validateToken();
          setCheckingToken(!isValid);
        } else {
          setCheckingToken(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setCheckingToken(false);
      }
    };
    
    checkToken();
  }, [isAuthenticated]);

  if (loading || checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#1A365D] border-r-[#1A365D] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#1A365D] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated || localStorage.getItem('superadmin_token') ? (
    <Navigate to="/superadmin/dashboard" replace />
  ) : (
    <Navigate to="/superadmin/login" replace />
  );
}
