import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { Truck } from 'lucide-react';

export default function CheckoutPayment() {
  const { shippingMethod, setShippingMethod } = useCheckout();
  const { cart, products } = useStore();
  const navigate = useNavigate();

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = shippingMethod === 'standard' ? (subtotal > 100 ? 0 : 15) : (subtotal > 200 ? 0 : 25);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={styles.card} className="cc-card">
      <h3 style={styles.title}>Payment</h3>
      <div style={styles.row}>
        <button
          onClick={() => setShippingMethod('standard')}
          className="cc-radio"
          aria-pressed={shippingMethod === 'standard'}
          style={styles.shipBtn}
        >
          <Truck size={16} style={{ marginRight: 8 }} /> Standard
        </button>
        <button
          onClick={() => setShippingMethod('express')}
          className="cc-radio"
          aria-pressed={shippingMethod === 'express'}
          style={styles.shipBtn}
        >
          <Truck size={16} style={{ marginRight: 8 }} /> Express
        </button>
      </div>

      <div style={styles.line}><span>Subtotal</span><span className="cc-total-shimmer">${subtotal.toFixed(2)}</span></div>
      <div style={styles.line}><span>Shipping</span><span className="cc-total-shimmer">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
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
