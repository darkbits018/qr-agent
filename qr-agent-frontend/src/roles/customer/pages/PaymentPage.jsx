import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [paymentStep, setPaymentStep] = useState('details'); // details, processing, success
  
  // Tax rate 10%
  const tax = cart.total * 0.1;
  const total = cart.total + tax;
  
  const handlePayment = (method) => {
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep('success');
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        navigate('/chat');
      }, 3000);
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#F5F7FA]"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md px-4 py-3 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-3 p-1 rounded-full hover:bg-gray-100"
          disabled={paymentStep !== 'details'}
        >
          <ChevronLeft size={24} className="text-[#7A7F87]" />
        </button>
        <h1 className="font-bold text-lg">Checkout</h1>
      </div>
      
      <div className="p-6">
        {paymentStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                    <div className="flex gap-2">
                      <span>{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <motion.button 
                  onClick={() => handlePayment('card')}
                  className="w-full py-4 px-6 bg-white border border-gray-200 rounded-lg flex items-center hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="mr-4 text-[#4C4C9D]" size={24} />
                  <div className="text-left">
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-[#7A7F87]">Visa, Mastercard, Amex</div>
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={() => handlePayment('wallet')}
                  className="w-full py-4 px-6 bg-white border border-gray-200 rounded-lg flex items-center hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Smartphone className="mr-4 text-[#4C4C9D]" size={24} />
                  <div className="text-left">
                    <div className="font-medium">Digital Wallet</div>
                    <div className="text-sm text-[#7A7F87]">Apple Pay, Google Pay</div>
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={() => handlePayment('cash')}
                  className="w-full py-4 px-6 bg-white border border-gray-200 rounded-lg flex items-center hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="mr-4 text-[#4C4C9D]" size={24} />
                  <div className="text-left">
                    <div className="font-medium">Cash</div>
                    <div className="text-sm text-[#7A7F87]">Pay at register</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
        
        {paymentStep === 'processing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="w-16 h-16 border-4 border-[#4C4C9D] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-[#7A7F87]">Please wait while we process your payment...</p>
          </motion.div>
        )}
        
        {paymentStep === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-4xl">✓</span>
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-[#7A7F87] mb-6">Thank you for your order. Your food is being prepared.</p>
            <p className="text-sm font-medium">Redirecting back to chat...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentPage;