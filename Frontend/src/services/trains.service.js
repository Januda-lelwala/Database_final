import api from './api';

/**
 * Trains Service
 * Handles all train-related API calls
 * All endpoints require admin authentication
 */

export const trainsService = {
  /**
   * Get all trains (admin only)
   */
  getAll: async (params = {}) => {
    const response = await api.get('/trains', { params });
    return response.data;
  },

  /**
   * Get trains by capacity (admin only)
   */
  getByCapacity: async (params = {}) => {
    const response = await api.get('/trains/capacity', { params });
    return response.data;
  },

  /**
   * Get train by ID (admin only)
   */
  getById: async (id) => {
    const response = await api.get(`/trains/${id}`);
    return response.data;
  },

  /**
   * Create new train (admin only)
   */
  create: async (trainData) => {
    const response = await api.post('/trains', trainData);
    return response.data;
  },

  /**
   * Update train (admin only)
   */
  update: async (id, trainData) => {
    const response = await api.put(`/trains/${id}`, trainData);
    return response.data;
  },

  /**
   * Delete train (admin only, requires manage_vehicles permission)
   */
  delete: async (id) => {
    const response = await api.delete(`/trains/${id}`);
    return response.data;
  }
};
