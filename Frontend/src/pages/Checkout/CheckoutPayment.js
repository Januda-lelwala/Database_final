import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function CheckoutPayment() {
  const { cart, products } = useStore();
  const navigate = useNavigate();

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  // Shipping cost is handled by the system based on train route assignment
  const shipping = 0; // Free shipping as part of rail distribution system
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={styles.card} className="cc-card">
      <h3 style={styles.title}>Order Summary</h3>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
        Your order will be delivered via our rail-based distribution system
      </p>

      <div style={styles.line}><span>Subtotal</span><span className="cc-total-shimmer">${subtotal.toFixed(2)}</span></div>
      <div style={styles.line}><span>Delivery (Train Route)</span><span className="cc-total-shimmer">FREE</span></div>
      <div style={styles.line}><span>Tax</span><span className="cc-total-shimmer">${tax.toFixed(2)}</span></div>
      <div style={styles.divider} />
      <div style={{ ...styles.line, fontWeight: 700 }}><span>Total</span><span>${total.toFixed(2)}</span></div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="cc-btn cc-btn-primary" onClick={() => navigate('/checkout/review')} style={styles.nextBtn}>Continue to Review →</button>
      </div>
    </div>
  );
}

const styles = {
  card: { margin: '0 auto', maxWidth: 600, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  title: { marginTop: 0 },
  row: { display: 'flex', gap: 12, marginBottom: 12 },
  shipBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 12, padding: '10px 12px' },
  line: { display: 'flex', justifyContent: 'space-between', margin: '8px 0' },
  divider: { height: 1, background: '#e5e7eb', margin: '8px 0' },
  nextBtn: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px' },
};
