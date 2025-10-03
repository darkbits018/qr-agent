
// src/roles/orgadmin/router.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { OrgAdminAuthProvider } from './context/OrgAdminAuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuItems from './pages/MenuItems';
import Tables from './pages/Tables';
import CreateStaffPage from './pages/CreateStaffPage';


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('orgadmin_token1');
  if (!token) {
    return <Navigate to="/orgadmin/login" replace />;
  }
  return children;
}

export default function OrgAdminRouter() {
  return (
    <OrgAdminAuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu-items"
          element={
            <ProtectedRoute>
              <MenuItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />
                <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <CreateStaffPage />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route
          path="/"
          element={
            localStorage.getItem('orgadmin_token') ? (
              <Navigate to="/orgadmin/dashboard" replace />
            ) : (
              <Navigate to="/orgadmin/login" replace />
            )
          }
        />
      </Routes>
    </OrgAdminAuthProvider>
  );
}