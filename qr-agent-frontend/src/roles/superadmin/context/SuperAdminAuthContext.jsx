// import { createContext, useContext, useState, useEffect } from 'react';
// import { superadminApi } from '../api/superadminApi';

// const SuperAdminAuthContext = createContext(null);

// export function SuperAdminAuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Check for existing auth on mount
//   useEffect(() => {
//     const token = localStorage.getItem('superadmin_token');
//     const userData = localStorage.getItem('superadmin_user');
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (err) {
//         console.error('Error parsing auth data:', err);
//         logout();
//       }
//     }
    
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       const response = await superadminApi.login({ email, password });
      
//       localStorage.setItem('superadmin_token', response.token);
//       localStorage.setItem('superadmin_user', JSON.stringify(response.user));
      
//       setUser(response.user);
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('superadmin_token');
//     localStorage.removeItem('superadmin_user');
//     setUser(null);
//   };

//   return (
//     <SuperAdminAuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         login,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </SuperAdminAuthContext.Provider>
//   );
// }

// export function useSuperAdminAuth() {
//   const context = useContext(SuperAdminAuthContext);
//   if (!context) {
//     throw new Error('useSuperAdminAuth must be used within a SuperAdminAuthProvider');
//   }
//   return context;
// }
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { superadminApi } from '../api/superadminApi';

const SuperAdminAuthContext = createContext(null);

const TOKEN_KEY = 'superadmin_token';
const USER_KEY = 'superadmin_user';
const SESSION_TYPE_KEY = 'superadmin_session_type';
const TOKEN_EXPIRY_KEY = 'superadmin_token_expiry';

export function SuperAdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [sessionType, setSessionType] = useState(localStorage.getItem(SESSION_TYPE_KEY) || 'temporary');
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);

  // Enhanced logout function to clear all auth data
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_TYPE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setUser(null);
    setError(null);
  }, []);

  // Function to validate token
  const validateToken = useCallback(async () => {
    try {
      setValidating(true);
      const isValid = await superadminApi.validateToken();
      
      if (!isValid) {
        console.warn('Token validation failed, logging out');
        logout();
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error validating token:', err);
      logout();
      return false;
    } finally {
      setValidating(false);
    }
  }, [logout]);

  // Check if token needs refresh based on expiry time
  const checkTokenExpiry = useCallback(() => {
    const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTimeStr) return false;
    
    const expiryTime = parseInt(expiryTimeStr, 10);
    const now = Date.now();
    
    // If token is expired or will expire in next 5 minutes
    if (now >= (expiryTime - 5 * 60 * 1000)) {
      return true;
    }
    return false;
  }, []);

  // Enhanced login with remember me functionality
  // const login = async (email, password, rememberMe = false) => {
  //   try {
  //     setError(null);
  //     setLoading(true);

  //     const response = await superadminApi.login({ email, password }, rememberMe);
  //     console.log('Login response:', response); // <-- Add this line

  //     // Store token and user data
  //     localStorage.setItem(TOKEN_KEY, response.superadmin_token);
  //     const fakeUser = { email }; // You can add more fields if you want
  //     setUser(fakeUser);
  //     localStorage.setItem(USER_KEY, JSON.stringify(response.user));      // Set session type (persistent or temporary)
  //     const sessionType = rememberMe ? 'persistent' : 'temporary';
  //     localStorage.setItem(SESSION_TYPE_KEY, sessionType);
  //     setSessionType(sessionType);
      
  //     // Set token expiry (current time + 24 hours for persistent session, 1 hour for temporary)
  //     const expiryTime = Date.now() + (rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000);
  //     localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    
  //     // Update user state
  //     setUser(response.user);
  //     setToken(response.superadmin_token);
  //     return response;
  //   } catch (err) {
  //     console.error('Login error:', err);
  //     setError(err.message || 'Failed to login. Please check your credentials.');
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password, rememberMe = false) => {
  try {
    setError(null);
    setLoading(true);

    const response = await superadminApi.login({ email, password }, rememberMe);
    console.log('Login response:', response);

    // Store token and user data
    localStorage.setItem(TOKEN_KEY, response.superadmin_token);

    // Always set a user object, since backend does not return one
    const fakeUser = { email }; // You can add more fields if you want
    setUser(fakeUser);
    localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));

    const sessionType = rememberMe ? 'persistent' : 'temporary';
    localStorage.setItem(SESSION_TYPE_KEY, sessionType);
    setSessionType(sessionType);

    // Set token expiry (current time + 24 hours for persistent session, 1 hour for temporary)
    const expiryTime = Date.now() + (rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    setToken(response.superadmin_token);
    return response;
  } catch (err) {
    console.error('Login error:', err);
    setError(err.message || 'Failed to login. Please check your credentials.');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Load and validate existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const userData = localStorage.getItem(USER_KEY);
        
        if (!token || !userData) {
          // No stored credentials
          logout();
          setLoading(false);
          return;
        }
        
        // Parse user data
        // Parse user data
        try {
          if (!userData || userData === "undefined") {
            throw new Error("No valid user data");
          }
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
          setLoading(false);
          return;
        }
        
        // Validate token if needed
        if (checkTokenExpiry()) {
          const isValid = await validateToken();
          if (!isValid) {
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setToken(token);
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [logout, validateToken, checkTokenExpiry]);

  // Set up periodic token validation
  useEffect(() => {
    // Only set up validation timer if we have a user
    if (!user) return;
    
    const validationInterval = setInterval(() => {
      if (checkTokenExpiry()) {
        validateToken(); // Will logout if validation fails
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(validationInterval);
  }, [user, validateToken, checkTokenExpiry]);

  return (
    <SuperAdminAuthContext.Provider
      value={{
        user,
        loading: loading || validating,
        error,
        login,
        logout,
        validateToken,
        isAuthenticated: !!user,
        sessionType,
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
}

export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error('useSuperAdminAuth must be used within a SuperAdminAuthProvider');
  }
  return context;
}