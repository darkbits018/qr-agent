// const BASE_URL = 'http://localhost:5000/api/customer';
// const API_URL = 'http://localhost:5000/api';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/customer`;
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const customerApi = {
  // Get Menu
  getMenu: async () => {
    const organizationId = localStorage.getItem('organization_id');
    if (!organizationId) {
      console.error('getMenu: organization_id not found in localStorage.');
      // Returning mock menu as a fallback to prevent UI crash.
      // In a real scenario, you might want to throw an error.
      return customerApi.getMockMenu();
    }

    const response = await fetch(`${BASE_URL}/menu?organization_id=${organizationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch menu');
    return response.json();
  },

  // Place Order
  placeOrder: async ({ table_id, organization_id, group_id, member_token }) => {
    const jwt = localStorage.getItem('jwt');
    const payload = { table_id, organization_id, group_id, member_token };
    const response = await fetch(`${BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to place order');
    return response.json();
  },

  // Get Order Status
  getOrderStatus: async (orderId) => {
    const jwt = localStorage.getItem('jwt');
    let url = `${BASE_URL}/order/${orderId}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
      console.log('[OrderStatus] Using JWT:', jwt);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      let errorMsg = 'Failed to fetch order status';
      try {
        const errorData = await response.clone().json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      console.error('[OrderStatus] Error:', errorMsg);
      throw new Error(errorMsg);
    }
    const data = await response.json();
    console.log('[OrderStatus] Response:', data);
    return data;
  },
  // Add Item to Cart
  addItemToCart: async (cartItem) => {
    const orgId = localStorage.getItem('organization_id');
    const tableId = localStorage.getItem('table_id');
    const groupId = localStorage.getItem('group_id');
    const memberToken = localStorage.getItem('member_token');
    const customerName = localStorage.getItem('customer_name') || 'Guest';

    const payload = {
      table_id: Number(tableId),
      organization_id: Number(orgId),
      menu_item_id: cartItem.id,
      quantity: cartItem.quantity,
      customer_name: customerName, // Include customer name with each item
    };

    if (groupId && memberToken) {
      payload.group_id = Number(groupId);
      payload.member_token = memberToken;
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    const jwt = localStorage.getItem('jwt');
    if (jwt && !(groupId && memberToken)) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to add item to cart');
    return response.json();
  },
  //view cart
  viewCart: async (isGroupCart = false) => {
    const groupId = localStorage.getItem('group_id');
    const memberToken = localStorage.getItem('member_token');

    let url = `${BASE_URL}/cart`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // For group cart
    if (isGroupCart && groupId && memberToken) {
      url += `?group_id=${groupId}&member_token=${memberToken}`;
    }
    // For personal cart in group
    else if (groupId && memberToken) {
      url += `?group_id=${groupId}&member_token=${memberToken}&personal=true`;
    }
    // For personal cart (individual)
    else {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers,
    });

    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch cart');
    return response.json();
  },

  // Remove Item from Cart
  removeCartItem: async (itemId) => {
    const groupId = localStorage.getItem('group_id');
    const memberToken = localStorage.getItem('member_token');
    const jwt = localStorage.getItem('jwt');
    let url = `${BASE_URL}/cart/${itemId}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // If group member, add group_id and member_token as query params, do NOT send JWT
    if (groupId && memberToken) {
      url += `?group_id=${groupId}&member_token=${memberToken}`;
    } else if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      headers,
    });

    if (!response.ok) {
      let errorMsg = 'Failed to remove item from cart';
      try {
        const errorData = await response.clone().json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }
    return response.json();
  },

  // Call Waiter
  callWaiter: async (tableId) => {
    try {
      const response = await fetch(`${BASE_URL}/waiter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ table_id: tableId }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to notify waiter');
      return response.json();
    } catch (err) {
      console.error('Error notifying waiter:', err.message);
      throw err;
    }
  },

  // Create Group
  createGroup: async (tableId, organizationId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const payload = {
        table_id: Number(tableId),
        organization_id: Number(organizationId),
      };
      const response = await fetch(`${API_URL}/group/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errorMsg = 'Failed to create group';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      }
      return response.json();
    } catch (err) {
      console.error('Error creating group:', err.message);
      throw err;
    }
  },

  // Join Group
  joinGroup: async (groupId, name) => {
    try {
      const response = await fetch(`${API_URL}/group/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
          name: name,
        }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to join group');
      return response.json();
    } catch (err) {
      console.error('Error joining group:', err.message);
      throw err;
    }
  },

  // Check Group Status
  checkGroupStatus: async (groupId, memberToken) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const url = `${API_URL}/group/status?group_id=${groupId}&member_token=${memberToken}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Failed to check group status');
      return response.json();
    } catch (err) {
      console.error('Error checking group status:', err.message);
      throw err;
    }
  },

  // View Group Cart
  viewGroupCart: async () => {
    const groupId = localStorage.getItem('group_id');
    const memberToken = localStorage.getItem('member_token');
    if (!groupId || !memberToken) throw new Error('Not in a group');
    const url = `${BASE_URL}/cart?group_id=${groupId}&member_token=${memberToken}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers,
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch group cart');
    return response.json();
  },

  // View Personal Cart
  viewPersonalCart: async () => {
    const groupId = localStorage.getItem('group_id');
    const memberToken = localStorage.getItem('member_token');
    if (!groupId || !memberToken) throw new Error('Not in a group');
    const url = `${BASE_URL}/cart?group_id=${groupId}&member_token=${memberToken}&personal=true`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers,
    });
    if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch personal cart');
    return response.json();
  },

  // Initialize Group
  initializeGroup: async () => {
    try {
      const tableId = localStorage.getItem('table_id');
      const orgId = localStorage.getItem('organization_id');
      if (!orgId || !tableId) {
        throw new Error('Organization ID or Table ID not found');
      }
      // Example: after successful group creation
      const result = await customerApi.createGroup(tableId, orgId);
      // result should contain { group_id, member_token }
      if (result && result.group_id && result.member_token) {
        localStorage.setItem('group_id', result.group_id);
        localStorage.setItem('member_token', result.member_token);
        // Optionally handle customer_name or other fields here
        // if (result.customer_name) {
        //   localStorage.setItem('customer_name', result.customer_name);
        // }
      }
      // else handle joinGroup if needed..
      // else if (result && result.group_id) { ... }
      return result;
    } catch (err) {
      console.error('Error initializing group:', err.message);
      throw err;
    }
  },

  // getMockMenu: async () => [
  //   {
  //     id: 1,
  //     name: 'Pizza',
  //     price: 299,
  //     description: 'Cheesy pizza',
  //     image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
  //     addOns: [
  //       { id: 101, name: 'Extra Cheese', price: 50 },
  //       { id: 102, name: 'Mushrooms', price: 40 },
  //       { id: 103, name: 'Pepperoni', price: 60 },
  //       { id: 104, name: 'Jalapeños', price: 30 },
  //       { id: 105, name: 'Olives', price: 35 },
  //       { id: 106, name: 'Pineapple', price: 45 },
  //       { id: 107, name: 'BBQ Sauce', price: 20 },
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: 'Veg Burger',
  //     price: 199,
  //     description: 'Fresh veggie burger',
  //     image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  //     addOns: [
  //       { id: 201, name: 'Cheese Slice', price: 30 },
  //       { id: 202, name: 'Bacon', price: 50 },
  //       { id: 203, name: 'Avocado', price: 60 },
  //       { id: 204, name: 'Fried Egg', price: 40 },
  //       { id: 205, name: 'Caramelized Onions', price: 25 },
  //       { id: 206, name: 'Spicy Mayo', price: 15 },
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: 'Pasta Alfredo',
  //     price: 249,
  //     description: 'Creamy Alfredo pasta',
  //     image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
  //     addOns: [
  //       { id: 301, name: 'Grilled Chicken', price: 80 },
  //       { id: 302, name: 'Shrimp', price: 100 },
  //       { id: 303, name: 'Truffle Oil', price: 60 },
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: 'French Fries',
  //     price: 99,
  //     description: 'Crispy golden fries',
  //     image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
  //     addOns: [
  //       { id: 401, name: 'Cheese Dip', price: 40 },
  //       { id: 402, name: 'Peri-Peri', price: 20 },
  //       { id: 403, name: 'Sour Cream', price: 30 },
  //       { id: 404, name: 'Bacon Bits', price: 50 },
  //     ]
  //   },
  //   {
  //     id: 6,
  //     name: 'Chicken Burger',
  //     price: 399,
  //     description: 'Fresh Chicken burger',
  //     image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
  //     addOns: [
  //       { id: 201, name: 'Cheese Slice', price: 30 },
  //       { id: 202, name: 'Bacon', price: 50 },
  //       { id: 203, name: 'Avocado', price: 60 },
  //       { id: 204, name: 'Fried Egg', price: 40 },
  //       { id: 205, name: 'Caramelized Onions', price: 25 },
  //       { id: 206, name: 'Spicy Mayo', price: 15 },
  //     ]
  //   },
  //   {
  //     id: 5,
  //     name: 'Chocolate Shake',
  //     price: 149,
  //     description: 'Rich chocolate shake',
  //     image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg',
  //     addOns: [] // No add-ons for shake to test empty state
  //   }
  // ],

  // -----------------------------------------
  getMockMenu: async () => [{
    id: 1,
    name: 'Pizza',
    price: 299,
    description: 'Cheesy pizza with a crispy crust',
    image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
    addOns: [
      { id: 101, name: 'Extra Cheese', price: 50 },
      { id: 102, name: 'Mushrooms', price: 40 },
      { id: 103, name: 'Pepperoni', price: 60 },
      { id: 104, name: 'Jalapeños', price: 30 },
      { id: 105, name: 'Olives', price: 35 },
      { id: 106, name: 'Pineapple', price: 45 },
      { id: 107, name: 'BBQ Sauce', price: 20 },
    ]
  },
  {
    id: 2,
    name: 'Veg Burger',
    price: 199,
    description: 'Fresh veggie burger with crunchy lettuce',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
    addOns: [
      { id: 201, name: 'Cheese Slice', price: 30 },
      { id: 202, name: 'Bacon (veg-style)', price: 50 },
      { id: 203, name: 'Avocado', price: 60 },
      { id: 204, name: 'Fried Egg', price: 40 },
      { id: 205, name: 'Caramelized Onions', price: 25 },
      { id: 206, name: 'Spicy Mayo', price: 15 },
    ]
  },
  {
    id: 3,
    name: 'Pasta Alfredo',
    price: 249,
    description: 'Creamy Alfredo pasta topped with parmesan',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    addOns: [
      { id: 301, name: 'Grilled Chicken', price: 80 },
      { id: 302, name: 'Shrimp', price: 100 },
      { id: 303, name: 'Truffle Oil', price: 60 },
    ]
  },
  {
    id: 4,
    name: 'French Fries',
    price: 99,
    description: 'Crispy golden fries served hot',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
    addOns: [
      { id: 401, name: 'Cheese Dip', price: 40 },
      { id: 402, name: 'Peri-Peri', price: 20 },
      { id: 403, name: 'Sour Cream', price: 30 },
      { id: 404, name: 'Bacon Bits', price: 50 },
    ]
  },
  {
    id: 5,
    name: 'Chicken Burger',
    price: 399,
    description: 'Juicy chicken patty in a soft bun',
    image: 'https://cdn.pixabay.com/photo/2014/10/23/18/05/burger-500054_1280.jpg',
    addOns: [
      { id: 501, name: 'Double Patty', price: 90 },
      { id: 502, name: 'Pickles', price: 20 },
      { id: 503, name: 'Cheddar Cheese', price: 35 },
    ]
  },
  {
    id: 6,
    name: 'Chocolate Shake',
    price: 149,
    description: 'Rich chocolate shake with whipped cream',
    image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg',
    addOns: [] // No add-ons
  },
  {
    id: 7,
    name: 'Sushi Platter',
    price: 499,
    description: 'Assorted sushi rolls with wasabi and soy sauce',
    image: 'https://cdn.pixabay.com/photo/2017/05/07/08/56/sushi-2295761_1280.jpg',
    addOns: [
      { id: 701, name: 'Extra Wasabi', price: 20 },
      { id: 702, name: 'Spicy Mayo', price: 25 },
      { id: 703, name: 'Teriyaki Glaze', price: 30 },
    ]
  },
  {
    id: 8,
    name: 'Grilled Sandwich',
    price: 179,
    description: 'Toasty sandwich with mixed veggies and sauces',
    image: 'https://cdn.pixabay.com/photo/2014/10/23/18/05/sandwich-500054_1280.jpg',
    addOns: [
      { id: 801, name: 'Extra Cheese', price: 25 },
      { id: 802, name: 'Paneer Tikka Filling', price: 45 },
      { id: 803, name: 'Mint Chutney Dip', price: 15 },
    ]
  },
  {
    id: 9,
    name: 'Masala Dosa',
    price: 109,
    description: 'Classic South Indian crispy dosa with masala',
    image: 'https://cdn.pixabay.com/photo/2020/07/21/05/45/indian-food-5426141_1280.jpg',
    addOns: [
      { id: 901, name: 'Extra Masala', price: 20 },
      { id: 902, name: 'Coconut Chutney', price: 15 },
      { id: 903, name: 'Butter Topping', price: 25 },
    ]
  },
  {
    id: 10,
    name: 'Mango Lassi',
    price: 89,
    description: 'Chilled mango lassi, smooth and refreshing',
    image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/mango-lassi-1238245_1280.jpg',
    addOns: [] // No add-ons
  }
  ],


  getMockCart: async () => ({
    items: [
      {
        id: 1,
        name: 'Pizza',
        price: 299,
        description: 'Cheesy pizza',
        image: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg',
        quantity: 2,
      },
      {
        id: 4,
        name: 'French Fries',
        price: 99,
        description: 'Crispy golden fries',
        image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
        quantity: 1,
      },
      {
        id: 5,
        name: 'Chocolate Shake',
        price: 149,
        description: 'Rich chocolate shake',
        image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg',
        quantity: 1,
      },
    ],
    total: 846,
  }),

  getMockOrders: async () => [
    {
      id: 2,
      name: 'Veg Burger',
      price: 199,
      description: 'Fresh veggie burger',
      image: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg',
      quantity: 1,
    },
    {
      id: 3,
      name: 'Pasta Alfredo',
      price: 249,
      description: 'Creamy Alfredo pasta',
      image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
      quantity: 2,
    },
  ],

  getMockPayment: async () => ({
    total: 846,
    tax: 84.6,
    grandTotal: 930.6,
  }),

};