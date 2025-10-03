import { Routes, Route, Navigate } from 'react-router-dom';
import { KitchenProvider } from './context/KitchenContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('kitchen_token');
  if (!token) {
    return <Navigate to="/kitchen/login" replace />;
  }
  return children;
}

export default function KitchenRouter() {
  return (
    <KitchenProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/"
          element={
            localStorage.getItem('kitchen_token') ? (
              <Navigate to="/kitchen/dashboard" replace />
            ) : (
              <Navigate to="/kitchen/login" replace />
            )
          }
        />
      </Routes>
    </KitchenProvider>
  );
}