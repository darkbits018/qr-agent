import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRef } from 'react';
import { customerApi } from '../../api/customerApi';
export default function CartSlideOver() {
  const {
    cart = { items: [], total: 0 },
    personalCart = { items: [], total: 0 },
    groupCart = { items: [], total: 0 },
    isCartOpen,
    toggleCart,
    removeFromCart,
    fetchCart,
    menuMap = {},
    isMenuLoading,
    cartType,
    setCartType,
    isInGroup,
  } = useCart();

  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const currentUserName = localStorage.getItem('customer_name') || 'You';
  useEffect(() => {
    fetchCart(cartType);
  }, [cartType, isCartOpen, fetchCart]);

  useEffect(() => {
    let interval;
    if (orderId) {
      interval = setInterval(async () => {
        try {
          const statusRes = await customerApi.getOrderStatus(orderId);
          setOrderStatus(statusRes); // store the full order object
        } catch (err) {
          setOrderStatus({ status: err.message });
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [orderId]);

  let itemsToShow = [];
  let totalToShow = 0;
  
  if (cartType === 'group') {
    itemsToShow = groupCart?.items || [];
    totalToShow = groupCart?.total || 0;
  } else {
    itemsToShow = isInGroup ? (personalCart?.items || []) : (cart?.items || []);
    totalToShow = isInGroup ? (personalCart?.total || 0) : (cart?.total || 0);
  }

  const handlePlaceOrder = async () => {
    if (!itemsToShow || itemsToShow.length === 0) return;
    try {
      const tableId = localStorage.getItem('table_id');
      const organizationId = localStorage.getItem('organization_id');
      const groupId = localStorage.getItem('group_id');
      const memberToken = localStorage.getItem('member_token');
      // Only group orders for now
      const result = await customerApi.placeOrder({
        table_id: Number(tableId),
        organization_id: Number(organizationId),
        group_id: Number(groupId),
        member_token: memberToken,
      });
      alert(result.message || 'Order placed successfully!');
      setOrderId(result.order_id);
      setOrderStatus('pending');
      toggleCart();
    } catch (err) {
      alert(err.message || 'Failed to place order.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await removeFromCart(itemId, cartType);
      await fetchCart(cartType);
    } catch (err) {
      alert(err.message || 'Failed to remove item from cart.');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-25 z-30"
            onClick={toggleCart}
          />
          <motion.div
            variants={{
              hidden: { x: '100%', opacity: 0 },
              visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25 } },
              exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-40 shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button onClick={toggleCart} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex gap-2 mb-2 p-4">
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    cartType === 'personal'
                      ? 'bg-[#4C4C9D] text-white shadow'
                      : 'bg-gray-100 text-[#4C4C9D] hover:bg-gray-200'
                  }`}
                  onClick={() => setCartType('personal')}
                >
                  My Cart
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                    cartType === 'group'
                      ? 'bg-[#4C4C9D] text-white shadow'
                      : 'bg-gray-100 text-[#4C4C9D] hover:bg-gray-200'
                  }`}
                  onClick={() => setCartType('group')}
                >
                  Group Cart
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {isMenuLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p>Loading...</p>
                  </div>
                ) : !itemsToShow || itemsToShow.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4">
                      <Trash2 size={24} />
                    </div>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {/* Group items by customer_name */}
                    {Object.entries(
                      itemsToShow.reduce((acc, item) => {
                        // Use backend name for grouping
                        const name = item.customer_name || item.ordered_by || 'Unknown';
                        if (!acc[name]) acc[name] = [];
                        acc[name].push(item);
                        return acc;
                      }, {})
                    ).map(([customer, items]) => (
                      <div key={customer} className="mb-4">
                        <div className="font-semibold text-[#4C4C9D] mb-2">
                          {customer === currentUserName ? 'You' : customer}:
                        </div>
                        {items.map((item) => {
                          const menuItem = menuMap[String(item.menu_item_id)] || menuMap[String(item.id)];
                          return (
                            <div key={item.id} className="py-2 flex items-center border-b last:border-b-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-xl">{menuItem?.emoji || '🍽️'}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{menuItem ? menuItem.name : `Unknown (${item.menu_item_id || item.id})`}</span>
                                  <span className="font-mono text-sm">
                                    {typeof menuItem?.price === 'number'
                                      ? `₹${(menuItem.price * item.quantity).toFixed(2)}`
                                      : '--'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="w-6 text-center">{item.quantity}</span>
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveItem(item.id)}
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-bold text-lg">
                    {typeof totalToShow === 'number'
                      ? `₹${totalToShow.toFixed(2)}`
                      : '--'}
                  </span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!itemsToShow || itemsToShow.length === 0}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    !itemsToShow || itemsToShow.length === 0 ? 'bg-gray-300' : 'bg-[#4C4C9D]'
                  }`}
                >
                  Place Order
                </button>
              </div>
              {orderId && (
  <div className="p-4 border-t bg-green-50 text-green-900">
    <div className="font-semibold">Order Status: {orderStatus?.status || orderStatus || 'pending'}</div>
    <div>Order ID: {orderId}</div>
    {orderStatus?.items && (
      <div className="mt-2">
        <div className="font-semibold mb-1">Ordered Items:</div>
        {Object.entries(
          orderStatus.items.reduce((acc, item) => {
            // Use backend name for grouping
            const name = item.ordered_by || item.customer_name || 'Unknown';
            if (!acc[name]) acc[name] = [];
            acc[name].push(item);
            return acc;
          }, {})
        ).map(([customer, items]) => (
          <div key={customer} className="mb-2">
            <div className="font-semibold text-[#4C4C9D]">
              {customer === currentUserName ? 'You' : customer}:
            </div>
            <ul className="pl-5">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center py-1">
                  <span>{item.name}</span>
                  <span className="mx-2">× {item.quantity}</span>
                  {item.price && (
                    <span className="text-xs text-gray-600 ml-2">₹{item.price}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-2 font-semibold">
          Total: ₹{orderStatus.total || '--'}
        </div>
      </div>
    )}
  </div>
)}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}