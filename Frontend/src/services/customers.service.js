import api from './api';

/**
 * Customers Service
 * Handles all customer-related API calls
 */

export const customersService = {
  /**
   * Get all customers (admin only)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  /**
   * Search customers (admin only)
   */
  search: async (params = {}) => {
    const response = await api.get('/customers/search', { params });
    return response.data;
  },

  /**
   * Get customer by ID (authenticated)
   */
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  /**
   * Create new customer (admin only)
   */
  create: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  /**
   * Update customer (authenticated)
   */
  update: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  /**
   * Delete customer (admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  /**
   * Get customer orders (authenticated)
   */
  getOrders: async (id, params = {}) => {
    const response = await api.get(`/customers/${id}/orders`, { params });
    return response.data;
  }
};
