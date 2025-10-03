import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useOTPVerify } from '../hooks/useOTPVerify';
import { ChefHat, MessageSquare, Phone, User } from 'lucide-react';
import { customerApi } from '../api/customerApi';

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, createGroup, joinGroup, organizationId } = useUser();
  const otpVerify = useOTPVerify();
  
  const [step, setStep] = useState('welcome'); // welcome, verification, party-size, qr-code
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [partySize, setPartySize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orgId = params.get('org_id');
    const tableId = params.get('table_id');
    if (orgId) localStorage.setItem('organization_id', orgId);
    if (tableId) localStorage.setItem('table_id', tableId);
  }, [location.search]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendOTP(formData.phone, formData.name); // Pass both phone and name
      setStep('verification');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      const otpValue = otpVerify.getOtpValue();
      const result = await verifyOTP(otpValue, formData.phone);
      if (result.success) {
        // Store JWT if present
        if (result.token) {
          localStorage.setItem('jwt', result.token);
        }
        setStep('party-size');
      } else {
        otpVerify.setError(result.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      otpVerify.setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectPartySize = async (size) => {
    setPartySize(size);
    setIsLoading(true);
    try {
      if (size === 1) {
        navigate('/customer/order-mode');
      } else {
        const tableIdRaw = localStorage.getItem('table_id');
        const orgId = organizationId || localStorage.getItem('organization_id');
        if (!orgId || !tableIdRaw) {
          alert('Organization ID or Table ID not found.');
          setIsLoading(false);
          return;
        }
        let tableId = Number(tableIdRaw);
        if (isNaN(tableId)) {
          tableId = await customerApi.getTableIdByNumber(tableIdRaw, orgId);
        }
        if (!tableId) {
          alert('Table not found. Please check your link or contact staff.');
          setIsLoading(false);
          return;
        }
        const customerName = localStorage.getItem('customer_name') || 'Guest';
        const result = await customerApi.createGroup(tableId, orgId);
        if (result && result.group_id && result.member_token) {
          localStorage.setItem('group_id', result.group_id);
          localStorage.setItem('member_token', result.member_token);
          if (result.customer_name) {
            localStorage.setItem('customer_name', result.customer_name);
          }
          // If backend returns QR image or URL, set them here:
          if (result.qr_image) setQrImage(result.qr_image);
          if (result.qr_url) setQrUrl(result.qr_url);
          setStep('qr-code'); // <-- THIS IS THE KEY LINE
        } else if (result && result.group_id) {
          const joinRes = await customerApi.joinGroup(result.group_id, customerName);
          if (joinRes && joinRes.member_token) {
            localStorage.setItem('group_id', result.group_id);
            localStorage.setItem('member_token', joinRes.member_token);
            if (joinRes.customer_name) {
              localStorage.setItem('customer_name', joinRes.customer_name);
            }
            // If backend returns QR image or URL, set them here:
            if (joinRes.qr_image) setQrImage(joinRes.qr_image);
            if (joinRes.qr_url) setQrUrl(joinRes.qr_url);
            setStep('qr-code'); // <-- THIS IS THE KEY LINE
          }
        }
      }
    } catch (error) {
      console.error('Error creating group:', error.message);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleJoinGroup = async (groupId, name) => {
    setIsLoading(true);
    try {
      const result = await joinGroup(groupId, name);
      if (result && result.member_token) {
        // Optionally store member_token
        navigate('/customer/order-mode');
      } else {
        alert('Failed to join group. Please try again.');
      }
    } catch (error) {
      alert(error.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinish = () => {
    navigate('/customer/order-mode');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {step === 'welcome' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
        >
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <ChefHat size={64} className="text-[#4C4C9D]" />
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-6"
          >
            Welcome to Our Restaurant
          </motion.h1>
          
          <motion.form 
            variants={containerVariants}
            onSubmit={handleSubmitUserInfo}
          >
            <motion.div 
              variants={itemVariants}
              className="mb-4"
            >
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-[#1A1A1A] mb-1"
              >
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A7F87]" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Afnan Ahmed"
                  required
                  className="input-field pl-10"
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mb-6"
            >
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-[#1A1A1A] mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A7F87]" size={18} />
                <input
                  type="mobile-phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 8296635241"
                  required
                  className="input-field pl-10"
                />
              </div>
            </motion.div>
            
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              Continue
            </motion.button>

            {/* Add this button in your 'welcome' step UI */}
            <button
              type="button"
              className="btn-secondary w-full mt-2"
              onClick={() => setStep('join-group')}
            >
              Join a Group
            </button>
          </motion.form>
        </motion.div>
      )}
      
      {step === 'verification' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-4"
          >
            Verify Your Number
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-center text-[#7A7F87] mb-8"
          >
            We've sent a 6-digit code to {formData.phone}
          </motion.p>
          

         <motion.div variants={containerVariants} className="flex gap-3 justify-center mb-8">
  {[0, 1, 2, 3, 4, 5].map((index) => (
    <motion.input
      key={index}
      id={`otp-${index}`}
      type="text"
      maxLength={1}
      value={otpVerify.otp[index]}
      onChange={(e) => otpVerify.handleOtpChange(index, e.target.value)}
      onKeyDown={(e) => otpVerify.handleKeyDown(index, e)}
      className="w-14 h-16 text-center text-2xl font-mono border rounded-lg focus:border-[#4C4C9D] focus:ring focus:outline-none"
      variants={itemVariants}
      whileFocus={{ scale: 1.05, borderColor: '#4C4C9D' }}
    />
  ))}
</motion.div>
{otpVerify.error && (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-red-500 text-center mb-4"
  >
    {otpVerify.error}
  </motion.p>
)}

          
          <motion.div variants={containerVariants} className="flex flex-col gap-3">
            <motion.button
              variants={itemVariants}
              onClick={handleVerifyOTP}
              disabled={!otpVerify.isComplete || isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              Verify Code
            </motion.button>
            
            <motion.button
              variants={itemVariants}
              onClick={() => setStep('welcome')}
              className="btn-secondary w-full"
            >
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      
      {step === 'party-size' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-4"
          >
            How many hungry legends at your table?
          </motion.h1>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <motion.button
              key="just-me"
              onClick={() => handleSelectPartySize(1)}
              className={`py-4 px-2 rounded-full text-lg font-medium transition-all ${
                partySize === 1
                  ? 'bg-[#4C4C9D] text-white'
                  : 'bg-[#EEF1F4] text-[#7A7F87] hover:bg-gray-200'
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Just Me
            </motion.button>
            {[2, 3, 4, 5, 6, '6+'].map((size) => (
              <motion.button
                key={size}
                onClick={() => handleSelectPartySize(size)}
                className={`py-4 px-2 rounded-full text-lg font-medium transition-all ${
                  partySize === size
                    ? 'bg-[#4C4C9D] text-white'
                    : 'bg-[#EEF1F4] text-[#7A7F87] hover:bg-gray-200'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {size}
              </motion.button>
            ))}
          </motion.div>
          
          <motion.button
            variants={itemVariants}
            onClick={() => setStep('verification')}
            className="btn-secondary w-full"
          >
            Go Back
          </motion.button>
        </motion.div>
      )}
      
      {step === 'qr-code' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-4"
          >
            Share with Your Table
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="bg-white p-4 rounded-lg shadow-md border-4 border-[#4C4C9D]">
              {qrImage ? (
                <img
                  src={`data:image/png;base64,${qrImage}`}
                  alt="Group QR Code"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <MessageSquare size={64} className="text-[#4C4C9D]" />
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.p
            variants={itemVariants}
            className="text-center text-[#7A7F87] mb-8"
          >
            📱 Share this QR with your squad so they can join your table.
          </motion.p>
          
          {qrUrl && (
  <div className="mt-4 text-center break-all">
    <span className="text-xs text-gray-500">Share Link:</span>
    <div className="text-sm">{qrUrl}</div>
  </div>
)}

          <motion.button
            variants={itemVariants}
            onClick={handleFinish}
            className="btn-primary w-full"
          >
            Continue to Chat
          </motion.button>
        </motion.div>
      )}
      
      {step === 'join-group' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md card glow-ring bg-[#EEF1F4]"
        >
          <motion.h1 className="text-2xl font-bold text-center mb-4">
            Join a Group
          </motion.h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const groupId = e.target.groupId.value;
              const name = e.target.name.value;
              await handleJoinGroup(groupId, name);
            }}
            className="space-y-4"
          >
            <input name="groupId" placeholder="Group ID" required className="input-field" />
            <input name="name" placeholder="Your Name" required className="input-field" />
            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Group'}
            </button>
          </form>
          <button className="btn-secondary w-full mt-2" onClick={() => setStep('welcome')}>
            Back
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default WelcomePage;