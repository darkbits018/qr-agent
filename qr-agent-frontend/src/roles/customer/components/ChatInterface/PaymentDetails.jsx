import React from 'react';
import { motion } from 'framer-motion';

const PaymentDetails = ({ total = 0, onPay }) => {
  const taxRate = 0.1;
  const tax = total * taxRate;
  const grandTotal = total + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full p-3 bg-[#faf9ff] border border-[#e0d3fb] rounded-lg shadow-inner"
    >
      <h3 className="text-base font-semibold text-[#4d2c91] mb-3">Payment</h3>

      <div className="space-y-2 text-xs text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">₹{total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax (10%)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-2 flex justify-between text-sm font-semibold text-[#2e1a52]">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onPay}
        className="mt-4 w-full py-1.5 rounded-md bg-gradient-to-r from-[#7e5bef] to-[#a389f4] text-white text-sm font-semibold hover:brightness-110 transition"
      >
        Pay Now
      </button>
    </motion.div>
  );
};

export default PaymentDetails;