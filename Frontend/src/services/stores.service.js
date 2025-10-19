import api from './api';

/**
 * Stores Service
 * Handles all store-related API calls
 */

export const storesService = {
  // ===== Public Endpoints =====

  /**
   * Get all stores
   */
  getAll: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  /**
   * Get available cities
   */
  getCities: async () => {
    const response = await api.get('/stores/cities');
    return response.data;
  },

  /**
   * Search stores by city
   */
  search: async (params = {}) => {
    const response = await api.get('/stores/search', { params });
    return response.data;
  },

  /**
   * Get store by ID
   */
  getById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  /**
   * Get store products
   */
  getProducts: async (id, params = {}) => {
    const response = await api.get(`/stores/${id}/products`, { params });
    return response.data;
  },

  // ===== Admin Endpoints =====

  /**
   * Create new store (admin only)
   */
  create: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },

  /**
   * Update store (admin only)
   */
  update: async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },

  /**
   * Delete store (admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },

  /**
   * Get store inventory (admin only)
   */
  getInventory: async (id, params = {}) => {
    const response = await api.get(`/stores/${id}/inventory`, { params });
    return response.data;
  },

  /**
   * Update store inventory (admin only)
   */
  updateInventory: async (id, inventoryData) => {
    const response = await api.patch(`/stores/${id}/inventory`, inventoryData);
    return response.data;
  },

  /**
   * Get store orders (admin only)
   */
  getOrders: async (id, params = {}) => {
    const response = await api.get(`/stores/${id}/orders`, { params });
    return response.data;
  }
};
