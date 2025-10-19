import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls for all user types
 */

export const authService = {
  // ===== User Authentication =====
  /**
   * Register a new customer
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login customer/user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get user profile (authenticated)
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // ===== Admin Authentication =====
  admin: {
    /**
     * Register new admin (admin only)
     */
    register: async (adminData) => {
      const response = await api.post('/auth/admin/register', adminData);
      return response.data;
    },

    /**
     * Admin login
     */
    login: async (credentials) => {
      const response = await api.post('/auth/admin/login', credentials);
      return response.data;
    },

    /**
     * Get admin profile (admin only)
     */
    getProfile: async () => {
      const response = await api.get('/auth/admin/profile');
      return response.data;
    }
  },

  // ===== Driver Authentication =====
  driver: {
    /**
     * Register new driver
     */
    register: async (driverData) => {
      const response = await api.post('/auth/driver/register', driverData);
      return response.data;
    },

    /**
     * Driver login
     */
    login: async (credentials) => {
      const response = await api.post('/auth/driver/login', credentials);
      return response.data;
      },

      /**
       * Change driver password
       */
      changePassword: async (driverId, passwordData) => {
        const response = await api.post(`/drivers/${driverId}/change-password`, passwordData);
        return response.data;
    }
  },

  // ===== Assistant Authentication =====
  assistant: {
    /**
     * Register new assistant
     */
    register: async (assistantData) => {
      const response = await api.post('/auth/assistant/register', assistantData);
      return response.data;
    },

    /**
     * Assistant login
     */
    login: async (credentials) => {
      const response = await api.post('/auth/assistant/login', credentials);
      return response.data;
      },

      /**
       * Change assistant password
       */
      changePassword: async (assistantId, passwordData) => {
        const response = await api.post(`/assistants/${assistantId}/change-password`, passwordData);
        return response.data;
    }
  },

  // ===== Common Actions =====
  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
};
