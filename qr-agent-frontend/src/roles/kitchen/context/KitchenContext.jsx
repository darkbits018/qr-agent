// import { createContext, useContext, useState, useEffect } from 'react';
// import { kitchenApi } from '../api/kitchenApi';

// export const KitchenContext = createContext();

// export function useKitchen() {
//   return useContext(KitchenContext);
// }

// export function KitchenProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('kitchen_token');
//     if (token) {
//       loadInitialData(token).catch((err) => {
//         console.error('Error loading initial data:', err);
//         logout();
//       });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const loadInitialData = async (token) => {
//     setLoading(true);
//     try {
//       const ordersData = await kitchenApi.getOrders(token);
//       setOrders(ordersData);
//     } catch (err) {
//       console.error('Error loading initial data:', err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const data = await kitchenApi.login({ email, password });
//       const token = data.token;
//       if (token && token.split('.').length === 3) {
//         localStorage.setItem('kitchen_token', token);
//       } else {
//         throw new Error('Invalid token received from server');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('kitchen_token');
//     setUser(null);
//     setOrders([]);
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const token = localStorage.getItem('kitchen_token');
//       const updatedOrder = await kitchenApi.updateOrderStatus(token, orderId, { status });
//       setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)));
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       if (err.message.includes('Unauthorized')) {
//         logout();
//       }
//       throw err;
//     }
//   };

//   return (
//     <KitchenContext.Provider
//       value={{
//         user,
//         orders,
//         login,
//         logout,
//         updateOrderStatus,
//         loading,
//       }}
//     >
//       {children}
//     </KitchenContext.Provider>
//   );
// }

import { createContext, useContext, useState, useEffect } from 'react';
import { kitchenApi } from '../api/kitchenApi';

export const KitchenContext = createContext();

export function useKitchen() {
  return useContext(KitchenContext);
}

export function KitchenProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('kitchen_token');
    if (token) {
      loadInitialData(token).catch((err) => {
        console.error('Error loading initial data:', err);
        logout();
      });
    } else {
      setLoading(false);
    }
  }, []);

  const loadInitialData = async (token) => {
    setLoading(true);
    try {
      const ordersData = await kitchenApi.getOrders(token);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await kitchenApi.login({ email, password });
      const token = data.staff_token; // ✅ FIXED HERE
      if (token && token.split('.').length === 3) {
        localStorage.setItem('kitchen_token', token);
        await loadInitialData(token);
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('kitchen_token');
    setUser(null);
    setOrders([]);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('kitchen_token');
      const updatedOrder = await kitchenApi.updateOrderStatus(token, orderId, { status });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      if (err.message.includes('Unauthorized')) {
        logout();
      }
      throw err;
    }
  };

  return (
    <KitchenContext.Provider
      value={{
        user,
        orders,
        login,
        logout,
        updateOrderStatus,
        loading,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}
