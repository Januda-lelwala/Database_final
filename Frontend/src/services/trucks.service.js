import api from './api';

/**
 * Trucks Service
 * Handles all truck-related API calls
 * All endpoints require admin authentication
 */

export const trucksService = {
  /**
   * Get all trucks (admin only)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/trucks', { params });
    return response.data;
  },

  /**
   * Search trucks (admin only)
   */
  search: async (params = {}) => {
    const response = await api.get('/trucks/search', { params });
    return response.data;
  },

  /**
   * Get trucks by capacity (admin only)
   */
  getByCapacity: async (params = {}) => {
    const response = await api.get('/trucks/capacity', { params });
    return response.data;
  },

  /**
   * Get truck by ID (admin only)
   */
  getById: async (id) => {
    const response = await api.get(`/trucks/${id}`);
    return response.data;
  },

  /**
   * Create new truck (admin only)
   */
  create: async (truckData) => {
    const response = await api.post('/trucks', truckData);
    return response.data;
  },

  /**
   * Update truck (admin only)
   */
  update: async (id, truckData) => {
    const response = await api.put(`/trucks/${id}`, truckData);
    return response.data;
  },

  /**
   * Delete truck (admin only, requires manage_vehicles permission)
   */
  delete: async (id) => {
    const response = await api.delete(`/trucks/${id}`);
    return response.data;
  }
};
