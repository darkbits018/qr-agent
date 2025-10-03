// const BASE_URL = 'http://localhost:5000/superadmin'; // For login
// const API_URL = 'http://localhost:5000/api/superadmin'; // For orgs and other CRUD
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/superadmin`; // For login
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/superadmin`; // For orgs and other CRUD
const TOKEN_KEY = 'superadmin_token';
const USER_KEY = 'superadmin_user';
const SESSION_TYPE_KEY = 'superadmin_session_type';
const TOKEN_EXPIRY_KEY = 'superadmin_token_expiry';

// Helper: Check if token exists and is valid
const isTokenValid = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    // If your token is a JWT, you could decode and check expiration
    // For now, we'll just check if token exists
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Helper: Get headers with auth
const getAuthHeaders = () => {
  // Check if token exists
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const superadminApi = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return isTokenValid();
  },

  // SuperAdmin Login
  login: async (credentials, rememberMe = false) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      mode: 'cors',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();

    // Ensure consistent token storage
    const token = data.superadmin_token || data.token;

    if (!token) {
      throw new Error('No token received from server');
    }

    // Save token and user data
    localStorage.setItem(TOKEN_KEY, token);

    // If user data is available in the response, store it
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    // Store session type and expiry if rememberMe is passed
    if (rememberMe) {
      localStorage.setItem(SESSION_TYPE_KEY, 'persistent');
      // Set expiry to 7 days
      const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } else {
      localStorage.setItem(SESSION_TYPE_KEY, 'temporary');
      // Set expiry to 1 hour
      const expiryTime = Date.now() + (60 * 60 * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    return {
      ...data,
      superadmin_token: token // Ensure consistent token property
    };
  },

  // Validate existing token
  validateToken: async () => {
    if (!isTokenValid()) return false;

    try {
      // Make a lightweight API call to verify the token is still accepted by the server
      // For this implementation, we'll use the organizations endpoint as a test
      // In a production environment, you should have a dedicated token validation endpoint
      const response = await fetch(`${API_URL}/organizations`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      // If the token is accepted, the response will be ok (status 200-299)
      // If not, the server will return 401 Unauthorized
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // SuperAdmin Logout (clear session)
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear any other session data if needed
    // sessionStorage.clear();
  },

  // Organization Endpoints
  createOrganization: async (orgData) => {
    const response = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orgData),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to create organization');
    return response.json();
  },

  listOrganizations: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/organizations${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch organizations');
    return response.json();
  },

  getOrganization: async (orgId) => {
    const response = await fetch(`${API_URL}/organizations/${orgId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch organization');
    return response.json();
  },

  updateOrganization: async (orgId, updates) => {
    const response = await fetch(`${API_URL}/organizations/${orgId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to update organization');
    return response.json();
  },

  deactivateOrganization: async (orgId) => {
    const response = await fetch(`${API_URL}/organizations/${orgId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to deactivate organization');
    return response.json();
  },

  // Admin Endpoints
  createAdmin: async (adminData) => {
    const response = await fetch(`${API_URL}/admins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to create admin');
    return response.json();
  },

  listAdmins: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/admins${queryParams ? `?${queryParams}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch admins');
    return response.json();
  },

  updateAdmin: async (adminId, updates) => {
    const response = await fetch(`${API_URL}/admins/${adminId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to update admin');
    return response.json();
  },

  deactivateAdmin: async (adminId) => {
    const response = await fetch(`${API_URL}/admins/${adminId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to deactivate admin');
    return response.json();
  },

};
