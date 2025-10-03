import { jwtDecode } from 'jwt-decode';

// const BASE_URL = 'http://localhost:5000//org-admin';
// const API_URL = 'http://localhost:5000/api/organizations';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/org-admin`;
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/organizations`;

export const orgadminApi = {
  // Login: Authenticate and store JWT
  login: async (credentials) => {
    console.log('🔐 Logging in with credentials:', credentials);

    try {
      console.log('🌐 Sending login request to:', `${BASE_URL}/login`);
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed. Response status:', response.status);
        console.error('❌ Login failed. Response data:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login successful. Response data:', data);

      // Save only the token to localStorage
      const token = data.org_admin_token || data.token;
      if (!token) {
        console.error('❌ No token found in login response:', data);
        throw new Error('No token received from the server.');
      }

      // Store token as orgadmin_token1 everywhere
      localStorage.setItem('orgadmin_token1', token);

      // Decode token and store organization_id for later use
      try {
        const decodedToken = jwtDecode(token);
        const organizationId = decodedToken.identity?.org_id;
        if (organizationId) {
          localStorage.setItem('organization_id', organizationId);
        }
      } catch (decodeError) {
        console.error('❌ Failed to decode token:', decodeError.message);
      }

      return data;
    } catch (error) {
      console.error('🚨 Login error:', error.message);
      throw new Error('Authentication failed. Check your credentials.');
    }
  },

  // Internal helper to get token or throw error
  _getToken: () => {
    try {
      let token = localStorage.getItem('orgadmin_token1');
      if (!token) {
        token = sessionStorage.getItem('orgadmin_token1');
      }
      if (!token) {
        window.location.href = '/login';
        throw new Error('Missing authentication. Please log in again.');
      }
      return token;
    } catch (error) {
      throw new Error('Token retrieval failed. Please log in again.');
    }
  },

  // Fetch menu items
  getMenuItems: async () => {
    console.log('📥 Fetching menu items...');
    const token = orgadminApi._getToken();

    try {
      console.log('🌐 Sending GET request to:', `${API_URL}/menu/items`);
      const response = await fetch(`${API_URL}/menu/items`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to fetch menu items. Response status:', response.status);
        console.error('❌ Failed to fetch menu items. Response data:', errorData);
        throw new Error(errorData.msg || 'Unable to fetch menu items.');
      }

      const data = await response.json();
      console.log('✅ Menu items retrieved:', data);
      return data;
    } catch (error) {
      console.error('🔥 Error in getMenuItems:', error.message);
      throw error;
    }
  },

  // Create a menu item
  createMenuItem: async (menuItemData, imageFiles = []) => {
    const token = orgadminApi._getToken();
    const formData = new FormData();

    // Append fields
    formData.append('name', menuItemData.name);
    formData.append('price', menuItemData.price);
    if (menuItemData.category) formData.append('category', menuItemData.category);
    if (menuItemData.dietary_preference) formData.append('dietary_preference', menuItemData.dietary_preference);
    if (menuItemData.available_times) formData.append('available_times', menuItemData.available_times);

    // Append images (up to 4)
    imageFiles.slice(0, 4).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/organizations/menu/items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type; browser will set it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create menu item.');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Bulk import menu items
  bulkImportMenuItems: async (file) => {
    const token = orgadminApi._getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('🌐 Sending POST request to:', `${API_URL}/menu/items/bulk`);
      const response = await fetch(`${API_URL}/menu/items/bulk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to bulk import menu items. Response status:', response.status);
        console.error('❌ Failed to bulk import menu items. Response data:', errorData);
        throw new Error(errorData.error || 'Failed to bulk import menu items.');
      }

      const data = await response.json();
      console.log('✅ Menu items bulk imported:', data);
      return data;
    } catch (error) {
      console.error('🔥 Error in bulkImportMenuItems:', error.message);
      throw error;
    }
  },

  // Update a menu item
  updateMenuItem: async (id, item) => {
    const token = orgadminApi._getToken();
    const response = await fetch(`${API_URL}/menu/items/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update menu item.');
    }
    return response.json();
  },

  // Delete a menu item
  deleteMenuItem: async (id) => {
    const token = orgadminApi._getToken();
    const response = await fetch(`${API_URL}/menu/items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete menu item.');
    }
    return response.json();
  },

  // Fetch tables
  getTables: async () => {
    console.log('📥 Fetching tables...');
    const token = orgadminApi._getToken();

    try {
      console.log('🌐 Sending GET request to:', `${API_URL}/tables`);
      const response = await fetch(`${API_URL}/tables`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to fetch tables. Response status:', response.status);
        console.error('❌ Failed to fetch tables. Response data:', errorData);
        throw new Error(errorData.msg || 'Unable to fetch tables.');
      }

      const data = await response.json();
      console.log('✅ Tables retrieved:', data);
      return data;
    } catch (error) {
      console.error('🔥 Error in getTables:', error.message);
      throw error;
    }
  },

  // Bulk create tables
  bulkCreateTables: async (count) => {
    const token = orgadminApi._getToken();
    try {
      console.log('🌐 Sending POST request to:', `${API_URL}/tables/bulk`);
      const response = await fetch(`${API_URL}/tables/bulk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('❌ Failed to bulk create tables. JSON Error:', errorData);
          throw new Error(errorData.error || 'Failed to bulk create tables.');
        } else {
          const text = await response.text();
          console.error('🧨 HTML Error Response:', text);
          throw new Error('Server error (non-JSON). Check backend logs.');
        }
      }

      const data = await response.json();
      console.log('✅ Tables bulk created:', data);
      return data;
    } catch (error) {
      console.error('🔥 Error in bulkCreateTables:', error.message);
      throw error;
    }
  },

  // Add tables
  addTables: async (input) => {
    const token = orgadminApi._getToken();

    try {
      let payload;

      if (Array.isArray(input)) {
        console.log("🎯 Input is an array of table names:", input);
        const sanitizedTables = input
          .map(num => (typeof num === "string" ? { number: num.trim() } : null))
          .filter(table => table !== null);

        if (sanitizedTables.length === 0) {
          console.error("🚫 No valid table names in the array.");
          throw new Error("No valid table names provided.");
        }

        payload = { tables: sanitizedTables };
      } else if (input && typeof input === "object" && typeof input.number === "string") {
        console.log("🎯 Input is a single table object:", input);
        payload = { number: input.number.trim() };
      } else {
        console.error("🚨 Invalid input format:", input);
        throw new Error("Input must be a table object or an array of table names.");
      }

      const apiUrl = `${API_URL}/tables`;
      console.log("🌐 Sending POST request to:", apiUrl);
      console.log("📤 Payload:", payload);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorDetails = {};
        if (contentType && contentType.includes('application/json')) {
          errorDetails = await response.json();
        } else {
          const text = await response.text();
          console.error("🧨 HTML Error Response:", text);
          throw new Error('Server returned non-JSON error.');
        }

        console.error("❌ Failed to add tables. Status:", response.status);
        console.error("❌ Error details:", errorDetails);
        throw new Error(errorDetails.error || 'Failed to add tables.');
      }

      const data = await response.json();
      console.log("✅ Tables added successfully:", data);
      return data;

    } catch (error) {
      console.error("🔥 Error in addTables:", error.message);
      throw error;
    }
  },

  // Delete tables
  deleteTables: async (tableIds) => {
    const token = orgadminApi._getToken();

    try {
      if (!Array.isArray(tableIds)) {
        throw new Error("Input must be an array of table IDs");
      }

      console.log('🌐 Sending DELETE request to:', `${API_URL}/tables`);
      const response = await fetch(`${API_URL}/tables`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ table_ids: tableIds }),
      });

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorDetails = {};
        if (contentType && contentType.includes('application/json')) {
          errorDetails = await response.json();
        } else {
          const text = await response.text();
          console.error("🧨 HTML Error Response:", text);
          throw new Error('Server returned non-JSON error.');
        }

        console.error('❌ Failed to delete tables. Status:', response.status);
        console.error('❌ Error details:', errorDetails);
        throw new Error(errorDetails.error || 'Failed to delete tables.');
      }

      const data = await response.json();
      console.log('✅ Tables deleted:', data);
      return data;
    } catch (error) {
      console.error('🔥 Error in deleteTables:', error.message);
      throw error;
    }
  },

  // Add a new staff member
  createStaffMember: async (staffData) => {
    const token = orgadminApi._getToken();
    const url = 'http://localhost:5000/api/organizations/staff'; // <-- Correct endpoint
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(staffData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create staff member.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

