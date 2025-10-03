import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { customerApi } from '../api/customerApi';

// Create Cart Context
const CartContext = createContext(null);

// Cart Provider Component
export function CartProvider({ children }) {
  const [personalCart, setPersonalCart] = useState({ items: [], total: 0 });
  const [groupCart, setGroupCart] = useState({ items: [], total: 0 });
  const [cart, setCart] = useState({ items: [], total: 0 }); // for solo mode
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuMap, setMenuMap] = useState({});
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [cartType, setCartType] = useState('personal');

  const isInGroup = useCallback(() => !!localStorage.getItem('group_id'), []);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menu = await customerApi.getMenu();
        const map = {};
        const items = Array.isArray(menu) ? menu : menu.items;
        if (Array.isArray(items)) {
          items.forEach(item => { 
            map[String(item.id)] = item; 
          });
        } else {
          console.error('Menu response missing items array:', menu);
        }
        setMenuMap(map);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setMenuMap({});
      } finally {
        setIsMenuLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const fetchCart = useCallback(async (type = cartType) => {
    try {
      if (isInGroup()) {
        if (type === 'group') {
          const data = await customerApi.viewGroupCart();
          setGroupCart(data);
        } else {
          const data = await customerApi.viewPersonalCart();
          setPersonalCart(data);
        }
      } else {
        const savedCart = sessionStorage.getItem('cart');
        setCart(savedCart ? JSON.parse(savedCart) : { items: [], total: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      if (isInGroup()) {
        if (type === 'group') {
          setGroupCart({ items: [], total: 0 });
        } else {
          setPersonalCart({ items: [], total: 0 });
        }
      } else {
        setCart({ items: [], total: 0 });
      }
    }
  }, [isInGroup, cartType]);

  useEffect(() => {
    if (!isInGroup()) {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInGroup]);

  const addToCart = async (item, type = cartType) => {
    if (isInGroup()) {
      await customerApi.addItemToCart({ id: item.id, quantity: 1 });
      await fetchCart(type);
    } else {
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(i => i.id === item.id);
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1,
          };
          return { items: updatedItems, total: calculateTotal(updatedItems, menuMap) };
        } else {
          const newItem = { ...item, quantity: 1 };
          const updatedItems = [...prevCart.items, newItem];
          return { items: updatedItems, total: calculateTotal(updatedItems, menuMap) };
        }
      });
    }
  };

  const removeFromCart = async (itemId, type = cartType) => {
    if (isInGroup()) {
      await customerApi.removeCartItem(itemId);
      await fetchCart(type);
    } else {
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        return { items: updatedItems, total: calculateTotal(updatedItems, menuMap) };
      });
    }
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const calculateTotal = (items, menuMapArg = menuMap) =>
    items.reduce((sum, item) => {
      const menuItem = menuMapArg[item.menu_item_id] || menuMapArg[item.id] || {};
      return sum + (menuItem.price || 0) * item.quantity;
    }, 0);

  const wsRef = useRef(null);

  useEffect(() => {
    const groupId = localStorage.getItem('group_id');
    if (!groupId) return;

    const ws = new WebSocket('wss://qr-agent.onrender.com/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(groupId);
    };

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);

        if (update.action === 'add') {
          const newItem = update.item;
          setGroupCart(prevCart => {
            const prevItems = prevCart.items || [];
            const existingItemIndex = prevItems.findIndex(
              item => item.id === newItem.id
            );
            let updatedItems;
            if (existingItemIndex >= 0) {
              updatedItems = [...prevItems];
              updatedItems[existingItemIndex].quantity = newItem.quantity;
            } else {
              updatedItems = [...prevItems, newItem];
            }
            return {
              ...prevCart,
              items: updatedItems,
              total: calculateTotal(updatedItems, menuMap)
            };
          });
        }

        if (update.action === 'remove') {
          const itemId = update.item_id;
          setGroupCart(prevCart => {
            const prevItems = prevCart.items || [];
            const updatedItems = prevItems.filter(item => item.id !== itemId);
            return {
              ...prevCart,
              items: updatedItems,
              total: calculateTotal(updatedItems, menuMap)
            };
          });
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
    // Only re-run if groupId changes
  }, [isInGroup(), menuMap]);

  return (
    <CartContext.Provider
      value={{
        cart,
        personalCart,
        groupCart,
        isCartOpen,
        addToCart,
        removeFromCart,
        toggleCart,
        fetchCart,
        menuMap,
        isMenuLoading,
        cartType,
        setCartType,
        isInGroup: isInGroup(),
        // Add these for chat integration:
        menuItems: Object.values(menuMap),
        orderedItems: groupCart.items, // or another source if you track orders separately
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};