// import { useState, useEffect } from 'react';

// export function useOTPVerify() {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [isComplete, setIsComplete] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Check if all OTP digits are filled
//   useEffect(() => {
//     setIsComplete(otp.every(digit => digit !== ''));
//   }, [otp]);
  
//   // Handle OTP input change
//   const handleOtpChange = (index, value) => {
//     // Only allow digits
//     if (!/^\d*$/.test(value)) return;
    
//     setError(null);
    
//     // Update the OTP array
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
    
//     // Auto-focus next input if current one is filled
//     if (value !== '' && index < 3) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };
  
//   // Handle backspace key
//   const handleKeyDown = (index, e) => {
//     // If backspace and current field is empty, focus previous field
//     if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) prevInput.focus();
//     }
//   };
  
//   // Clear OTP inputs
//   const clearOtp = () => {
//     setOtp(['', '', '', '']);
//     setIsComplete(false);
//     setIsVerified(false);
//     setError(null);
//   };
  
//   // Get OTP as string
//   const getOtpValue = () => otp.join('');
  
//   // Try to use Web OTP API if available
//   useEffect(() => {
//     if (typeof navigator.credentials !== 'undefined' && 
//         'OTPCredential' in window &&
//         navigator.credentials.get) {
      
//       const abortController = new AbortController();
      
//       navigator.credentials.get({
//         otp: { transport: ['sms'] },
//         signal: abortController.signal
//       }).then(otp => {
//         if (otp && otp.code) {
//           // Split the OTP code into an array of digits
//           const otpArray = otp.code.split('').slice(0, 4);
//           setOtp(otpArray);
//         }
//       }).catch(err => {
//         // Just ignore errors - this is expected on unsupported devices
//         console.log('Web OTP API not supported or user declined permission');
//       });
      
//       // Clean up the abort controller
//       return () => {
//         abortController.abort();
//       };
//     }
//   }, []);
  
//   return {
//     otp,
//     isComplete,
//     isVerified,
//     error,
//     setIsVerified,
//     setError,
//     handleOtpChange,
//     handleKeyDown,
//     clearOtp,
//     getOtpValue
//   };
// }//--------------------------------------------------ORIGINAL-----------------------------------

// src/roles/customer/hooks/useOTPVerify.js
import { useState } from 'react';

export function useOTPVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State for OTP digits
  const [error, setError] = useState(null); // Error message state
  const [isComplete, setIsComplete] = useState(false); // Tracks if OTP is fully entered

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus the next input field if the current one is filled
    if (value !== '' && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Check if OTP is complete
    setIsComplete(newOtp.every(digit => digit !== ''));
  };

  // Handle keydown events (e.g., backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      // Focus the previous input field if the current one is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Clear OTP inputs
  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setIsComplete(false);
    setError(null);
  };

  // Get OTP as a string
  const getOtpValue = () => otp.join('');

  return {
    otp,
    error,
    setError,
    isComplete,
    handleOtpChange,
    handleKeyDown,
    clearOtp,
    getOtpValue,
  };
}