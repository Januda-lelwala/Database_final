
import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Receipt, Calendar, DollarSign, Package } from 'lucide-react';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import { ordersAPI } from '../../services/ordersAPI';


export default function Orders(){
  const { orders, setOrders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    if (!document.getElementById('orders-animations')) {
      const style = document.createElement('style');
      style.id = 'orders-animations';
      style.innerHTML = `
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .order-card { animation: fadeUp 0.25s ease; cursor:pointer; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Add setOrders to context if not present
  // Cancel order handler
  const handleCancelOrder = async (orderId, reason) => {
    // Call backend
    await ordersAPI.cancelOrder(orderId, reason);
    // Update local state
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: reason } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
    setModalOpen(false);
  };


  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Order History</h1>
        <p style={styles.subtitle}>Review your recent purchases and their status.</p>
      </div>

      <div style={styles.list}>
        {orders.length === 0 && (
          <div style={styles.empty}>No orders yet.</div>
        )}
        {orders.map((o) => (
          <div key={o.id} style={styles.card} className="order-card" onClick={() => { setSelectedOrder(o); setModalOpen(true); }}>
            <div style={styles.row}>
              <div style={styles.meta}><Receipt size={16}/> {o.id}</div>
              <div style={styles.meta}><Calendar size={16}/> {new Date(o.placedAt).toLocaleString()}</div>
              <div style={styles.meta}><DollarSign size={16}/> ${o.total.toFixed(2)}</div>
              <div style={styles.status}>{o.status}</div>
            </div>
            <div style={styles.items}>
              {o.items.slice(0,3).map((i, idx) => (
                <div key={idx} style={styles.item}><Package size={14}/> {i.title} × {i.qty}</div>
              ))}
              {o.items.length > 3 && <div style={styles.more}>+{o.items.length - 3} more items</div>}
            </div>
          </div>
        ))}
      </div>
      <OrderDetailsModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCancel={handleCancelOrder}
      />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 24 },
  header: { maxWidth: 980, margin: '0 auto 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: 0, color: '#475569' },
  list: { maxWidth: 980, margin: '0 auto', display: 'grid', gap: 12 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, alignItems: 'center' },
  meta: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#334155', fontWeight: 600 },
  status: { justifySelf: 'end', background: '#eef2ff', color: '#4338ca', padding: '4px 8px', borderRadius: 10, fontWeight: 700 },
  items: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 },
  item: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569' },
  more: { color: '#64748b', fontStyle: 'italic' },
  empty: { background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 12, padding: 16, textAlign: 'center', color: '#64748b' },
};
