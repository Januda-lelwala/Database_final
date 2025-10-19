import React from 'react';
import { getPlaceholderImage as makePh } from '../../utils/placeholder';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CheckoutCart() {
  const { cart, products, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });

  if (items.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Add packaging supplies to your cart to continue</p>
        <Link to="/products" style={styles.continueShoppingBtn}>Browse Packaging Catalog</Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);

  return (
    <div style={styles.card} className="cc-card">
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Cart</h3>
        <span style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div style={styles.list}>
        {items.map(item => (
          <div key={item.id} style={styles.row} className="cc-row">
            <div style={styles.imageBox}>
              <img alt={item.title} src={makePh(item.title?.split(' ')[0] || 'Item', 64, 64, '#4facfe', '#ffffff')} style={{ width: 64, height: 64, borderRadius: 8 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.title}</div>
              <div style={{ opacity: 0.8 }}>Qty: {item.qty}</div>
            </div>
            <div style={{ fontWeight: 700 }}>${item.lineTotal.toFixed(2)}</div>
            <button className="cc-btn cc-btn-ghost" style={styles.removeBtn} onClick={() => removeFromCart(item.id)}><Trash2 size={14} style={{ marginRight: 6 }} />Remove</button>
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        <div>Subtotal</div>
        <div style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button className="cc-btn cc-btn-ghost" style={styles.clearBtn} onClick={clearCart}><Trash2 size={14} style={{ marginRight: 6 }} />Clear Cart</button>
        <button className="cc-btn cc-btn-primary" style={styles.nextBtn} onClick={() => navigate('/checkout/details')}>Continue <ArrowRight size={16} style={{ marginLeft: 6 }} /></button>
      </div>
    </div>
  );
}

const styles = {
  card: { margin: '0 auto', maxWidth: 900, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { margin: 0 },
  itemCount: { opacity: 0.7 },
  list: { display: 'grid', gap: 12, marginBottom: 16 },
  row: { display: 'grid', gridTemplateColumns: '64px 1fr auto auto', alignItems: 'center', gap: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 },
  imageBox: { width: 64, height: 64, borderRadius: 8, overflow: 'hidden' },
  removeBtn: { display: 'inline-flex', alignItems: 'center' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0' },
  clearBtn: { display: 'inline-flex', alignItems: 'center' },
  nextBtn: { display: 'inline-flex', alignItems: 'center' },
  emptyCart: { margin: '0 auto', maxWidth: 600, background: 'white', borderRadius: 12, padding: 24, textAlign: 'center' },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { marginBottom: 6 },
  emptyText: { opacity: 0.8, marginBottom: 12 },
  continueShoppingBtn: { display: 'inline-block', color: 'white', background: '#6366f1', borderRadius: 8, padding: '10px 16px' },
};
