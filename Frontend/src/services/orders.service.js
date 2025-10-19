import api from './api';

/**
 * Orders Service
 * Handles all order-related API calls
 */

export const ordersService = {
  /**
   * Get all orders (admin only)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  /**
   * Get order by ID (authenticated)
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Create new order (authenticated)
   */
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  /**
   * Update order (authenticated)
   */
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  /**
   * Delete order (admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  /**
   * Get order items (authenticated)
   */
  getItems: async (id) => {
    const response = await api.get(`/orders/${id}/items`);
    return response.data;
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/orders/${id}/status`, statusData);
    return response.data;
  }
};
