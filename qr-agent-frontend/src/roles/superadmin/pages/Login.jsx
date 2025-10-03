// // src/roles/superadmin/pages/Login.jsx
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login, loading, isAuthenticated } = useSuperAdminAuth();

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       const from = location.state?.from?.pathname || '/superadmin/dashboard';
//       navigate(from, { replace: true });
//     }
//   }, [isAuthenticated, navigate, location]);

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setIsSubmitting(true);

//   try {
//     await login(email, password, rememberMe);
//     // Navigation is handled by the useEffect above when isAuthenticated changes
//   } catch (err) {
//     console.error('Login error:', err);
//     setError(err.message || 'Invalid credentials. Please try again.');
//   } finally {
//     setIsSubmitting(false); // <-- Always stop spinner
//   }
// };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="min-h-screen flex items-center justify-center bg-[#F5F7FA]"
//     >
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-[#1A365D] mb-6">SuperAdmin Login</h2>
        
//         {/* Login Status Messages */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}
        
//         {loading && !isSubmitting && (
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
//             <p className="text-blue-700">Checking authentication status...</p>
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1A365D] focus:border-[#1A365D]"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1A365D] focus:border-[#1A365D]"
//               required
//             />
//           </div>
          
//           {/* Remember Me Checkbox */}
//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               name="remember-me"
//               type="checkbox"
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//               className="h-4 w-4 text-[#1A365D] focus:ring-[#1A365D] border-gray-300 rounded"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//               Remember me
//             </label>
//           </div>
          
//           <button
//             type="submit"
//             disabled={loading || isSubmitting}
//             className="w-full bg-[#1A365D] text-white py-2 rounded-md hover:bg-[#122b4a] transition-colors flex items-center justify-center"
//           >
//             {loading || isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Logging in...
//               </>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>
//       </div>
//     </motion.div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext';
import { FiLogIn, FiMail, FiLock, FiCheckCircle, FiLoader } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, isAuthenticated } = useSuperAdminAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/superadmin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password, rememberMe);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-beige-50 p-8 rounded-xl shadow-lg w-full max-w-md border border-beige-200"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-4 shadow-md"
          >
            <FiLogIn className="text-3xl text-beige-50" />
          </motion.div>
          <h2 className="text-3xl font-bold text-teal-800">Super Admin Portal</h2>
          <p className="text-teal-600 mt-2">Enter your credentials to continue</p>
        </div>
        
        {/* Login Status Messages */}
        {error && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r"
          >
            <p className="text-red-700 flex items-center gap-2">
              <FiCheckCircle />
              {error}
            </p>
          </motion.div>
        )}
        
        {loading && !isSubmitting && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-teal-50 border-l-4 border-teal-400 p-4 mb-6 rounded-r"
          >
            <p className="text-teal-700 flex items-center gap-2">
              <FiLoader className="animate-spin" />
              Checking authentication status...
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <label className="block text-sm font-medium text-teal-700">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-teal-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-beige-100 border border-beige-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 focus:bg-beige-50 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            <label className="block text-sm font-medium text-teal-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-teal-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-beige-100 border border-beige-300 rounded-lg focus:ring-2 focus:ring-teal-300 focus:border-teal-300 focus:bg-beige-50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>
          
          {/* Remember Me Checkbox */}
          <motion.div 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center"
          >
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-beige-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-teal-700">
              Remember me
            </label>
          </motion.div>
          
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 text-beige-50 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading || isSubmitting ? (
              <>
                <FiLoader className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <a href="#" className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors">
            Forgot your password?
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;