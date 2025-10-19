import api from './api';

/**
 * Products Service
 * Handles all product-related API calls
 */

export const productsService = {
  // ===== Public Endpoints =====
  
  /**
   * Get all products
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Search products
   */
  search: async (params = {}) => {
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  /**
   * Get products by category
   */
  getByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // ===== Admin Endpoints =====

  /**
   * Get low stock products (admin only)
   */
  getLowStock: async (params = {}) => {
    const response = await api.get('/products/low-stock', { params });
    return response.data;
  },

  /**
   * Create new product (admin only)
   */
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Update product (admin only)
   */
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Update product stock (admin only)
   */
  updateStock: async (id, stockData) => {
    const response = await api.patch(`/products/${id}/stock`, stockData);
    return response.data;
  }
};
