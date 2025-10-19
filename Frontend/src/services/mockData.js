// Mock data for development when backend is not available
export const mockAuth = {
  login: async ({ username, password, role }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers = {
      admin: {
        username: 'admin',
        password: 'admin123',
        user: {
          id: 'ADM001',
          username: 'admin',
          name: 'System Administrator',
          role: 'admin'
        },
        token: 'mock_admin_token_12345'
      },
      customer: {
        username: 'customer',
        password: 'customer123',
        user: {
          id: 'CUST_001',
          username: 'customer',
          name: 'John Doe',
          role: 'customer'
        },
        token: 'mock_customer_token_12345'
      }
    };

    const userConfig = mockUsers[role];
    if (!userConfig || username !== userConfig.username || password !== userConfig.password) {
      throw new Error('Invalid credentials');
    }

    return {
      data: {
        message: 'Login successful',
        user: userConfig.user,
        token: userConfig.token
      }
    };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: `CUST_${Date.now()}`,
      username: userData.user_name,
      name: userData.name,
      role: 'customer'
    };

    return {
      data: {
        message: 'Registration successful',
        user: newUser,
        token: `mock_token_${Date.now()}`
      }
    };
  },

  verify: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('authToken');
    if (!token || token.startsWith('mock_')) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        data: {
          user: userData,
          valid: true
        }
      };
    }
    
    throw new Error('Invalid token');
  }
};

export const mockProducts = {
  getAll: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const products = [
      {
        product_id: 'PROD_001',
        product_name: 'Premium Electronics Package',
        description: 'High-quality electronics with fast delivery',
        price: 299.99,
        weight_per_item: 2.5,
        volume_per_item: 0.02,
        category: 'Electronics',
        available_quantity: 50
      },
      {
        product_id: 'PROD_002',
        product_name: 'Fashion Essentials',
        description: 'Trendy fashion accessories and clothing',
        price: 79.99,
        weight_per_item: 0.5,
        volume_per_item: 0.005,
        category: 'Fashion',
        available_quantity: 100
      },
      {
        product_id: 'PROD_003',
        product_name: 'Home & Garden Supplies',
        description: 'Essential home improvement and garden items',
        price: 149.99,
        weight_per_item: 5.0,
        volume_per_item: 0.1,
        category: 'Home & Garden',
        available_quantity: 25
      },
      {
        product_id: 'PROD_004',
        product_name: 'Books & Educational Media',
        description: 'Books, courses, and educational materials',
        price: 29.99,
        weight_per_item: 0.8,
        volume_per_item: 0.003,
        category: 'Books',
        available_quantity: 75
      },
      {
        product_id: 'PROD_005',
        product_name: 'Sports Equipment',
        description: 'Quality sports gear and accessories',
        price: 199.99,
        weight_per_item: 3.2,
        volume_per_item: 0.05,
        category: 'Sports',
        available_quantity: 30
      }
    ];

    return {
      data: {
        products,
        pagination: {
          page: 1,
          limit: 10,
          total: products.length,
          pages: 1
        }
      }
    };
  },

  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: {
        categories: ['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports']
      }
    };
  }
};

export const mockOrders = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const orders = [
      {
        order_id: 'ORD_001',
        order_date: '2025-01-09T10:30:00Z',
        destination_city: 'Colombo',
        destination_address: '123 Main Street, Colombo 01',
        order_status: 'In Transit',
        item_count: 2,
        total_amount: 379.98
      },
      {
        order_id: 'ORD_002',
        order_date: '2025-01-08T14:20:00Z',
        destination_city: 'Kandy',
        destination_address: '456 Temple Road, Kandy',
        order_status: 'Delivered',
        item_count: 1,
        total_amount: 149.99
      }
    ];

    return {
      data: {
        orders,
        pagination: {
          page: 1,
          limit: 10,
          total: orders.length,
          pages: 1
        }
      }
    };
  }
};

export const mockCustomers = {
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: {
        stats: {
          total_orders: 12,
          pending_orders: 2,
          delivered_orders: 8,
          in_transit_orders: 2,
          total_spent: 1849.89
        },
        recent_orders: [
          {
            order_id: 'ORD_001',
            order_date: '2025-01-09T10:30:00Z',
            order_status: 'In Transit',
            destination_city: 'Colombo',
            item_count: 2,
            total_amount: 379.98
          }
        ]
      }
    };
  }
};

export const mockAdmin = {
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: {
        stats: {
          total_orders: 156,
          pending_orders: 23,
          delivered_orders: 98,
          in_transit_orders: 31,
          cancelled_orders: 4,
          total_customers: 45,
          total_products: 127,
          total_revenue: 45789.56
        },
        recent_orders: [
          {
            order_id: 'ORD_156',
            order_date: '2025-01-09T15:30:00Z',
            order_status: 'Pending',
            destination_city: 'Galle',
            customer_name: 'Jane Smith',
            customer_username: 'janesmith',
            item_count: 3,
            total_amount: 529.97
          }
        ],
        low_stock_products: [
          {
            product_id: 'PROD_003',
            product_name: 'Home & Garden Supplies',
            available_quantity: 5
          }
        ]
      }
    };
  }
};