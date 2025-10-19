import api from './api';

export const ordersAPI = {
  cancelOrder: async (orderId, reason) => {
    // Adjust endpoint as needed for your backend
    const res = await api.patch(`/orders/${orderId}/cancel`, { reason });
    return res.data;
  },
};
