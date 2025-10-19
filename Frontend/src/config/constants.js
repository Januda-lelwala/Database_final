// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// App Configuration
export const APP_NAME = 'KandyPack';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist'
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DRIVER: 'driver',
  ASSISTANT: 'assistant'
};

// Portal Types
export const PORTAL_TYPES = {
  CUSTOMER: 'customer',
  EMPLOYEE: 'employee'
};

// API Timeout
export const API_TIMEOUT = 10000;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  CUSTOMER_PORTAL: '/customer',
  EMPLOYEE_PORTAL: '/employee',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  PROFILE: '/profile'
};
