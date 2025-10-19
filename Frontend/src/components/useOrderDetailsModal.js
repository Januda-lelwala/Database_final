import React, { useState } from 'react';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import { ordersAPI } from '../../services/ordersAPI';

export function useOrderDetailsModal() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]); // This should be passed from parent in real usage

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  const handleClose = () => setModalOpen(false);

  const handleCancelOrder = async (orderId, reason) => {
    await ordersAPI.cancelOrder(orderId, reason);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: reason } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
    setModalOpen(false);
  };

  const modal = (
    <OrderDetailsModal
      order={selectedOrder}
      open={modalOpen}
      onClose={handleClose}
      onCancel={handleCancelOrder}
    />
  );

  return { handleOpen, handleClose, modal, setOrders };
}
