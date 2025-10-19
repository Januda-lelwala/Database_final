import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useCheckout } from '../../context/CheckoutContext';
import { ordersAPI } from '../../services/api';
import { CreditCard, ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function CheckoutReview() {
  const { user } = useAuth();
  const { cart, products, clearCart } = useStore();
  const navigate = useNavigate();
  const {
    destinationCity,
    destinationAddress,
    shippingMethod,
    processing,
    setProcessing,
    error,
    setError,
    orderSuccess,
    setOrderSuccess,
  } = useCheckout();

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id || p.product_id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = shippingMethod === 'standard' ? (subtotal > 100 ? 0 : 15) : (subtotal > 200 ? 0 : 25);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setProcessing(true);
      setError(null);
      
      // Verify authentication token exists
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Session expired. Please login again.');
      }
      
      if (!destinationCity.trim() || !destinationAddress.trim()) {
        throw new Error('Please enter destination city and address');
      }
      if (cart.length === 0) {
        throw new Error('Your cart is empty');
      }
      const itemsPayload = cart.map((ci) => {
        const p = products.find((pp) => pp.id === ci.id || pp.product_id === ci.id);
        if (!p) throw new Error('One or more cart items are invalid');
        return { product_id: p.product_id ?? p.id, quantity: ci.qty, price: Number(p.price) || 0 };
      });
      
      const orderPayload = { 
        destination_city: destinationCity, 
        destination_address: destinationAddress, 
        items: itemsPayload 
      };
      
      await ordersAPI.create(orderPayload);
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        if (user?.role === 'customer') navigate('/customer');
        else if (['admin','driver','assistant'].includes(user?.role)) navigate('/employee');
        else navigate('/login');
      }, 1500);
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Failed to place order';
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={styles.card} className="cc-card">
        <div style={{ textAlign: 'center' }}>
          <div style={styles.successIcon}><CheckCircle2 size={48} color="#22c55e" /></div>
          <h2>Order Placed Successfully!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card} className="cc-card">
      <h3 style={styles.title}>Review & Place Order</h3>
      <div style={styles.line}><span>Destination City</span><span>{destinationCity || '-'}</span></div>
      <div style={styles.line}><span>Destination Address</span><span>{destinationAddress || '-'}</span></div>
      <div style={styles.line}><span>Subtotal</span><span className="cc-total-shimmer">${subtotal.toFixed(2)}</span></div>
      <div style={styles.line}><span>Shipping</span><span className="cc-total-shimmer">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
      <div style={styles.line}><span>Tax</span><span className="cc-total-shimmer">${tax.toFixed(2)}</span></div>
      <div style={styles.divider} />
      <div style={{ ...styles.line, fontWeight: 700 }}><span>Total</span><span>${total.toFixed(2)}</span></div>
      {error && <div style={styles.error}>{error}</div>}
      {!user && (
        <div style={styles.loginNotice}>
          <span style={styles.loginIcon}><Lock size={20}/></span>
          <div>
            <p>Please sign in to continue</p>
          </div>
        </div>
      )}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="cc-btn cc-btn-primary" disabled={!user || processing} onClick={placeOrder} style={{ ...styles.placeOrderBtn, ...((!user || processing) ? styles.disabled : {}) }}>
          {processing ? 'Processing...' : (<><CreditCard size={18} style={{marginRight: 6}}/>Place Order<ArrowRight size={18} style={{marginLeft: 6}}/></>)}
        </button>
      </div>
      <div style={styles.securityBadges}>
        <span style={styles.securityBadge}><ShieldCheck size={14} style={{marginRight: 6}}/> Secure Checkout</span>
        <span style={styles.securityBadge}><Lock size={14} style={{marginRight: 6}}/> SSL Protected</span>
      </div>
    </div>
  );
}

const styles = {
  card: { margin: '0 auto', maxWidth: 700, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  title: { marginTop: 0 },
  line: { display: 'flex', justifyContent: 'space-between', margin: '8px 0' },
  divider: { height: 1, background: '#e5e7eb', margin: '8px 0' },
  error: { marginTop: 10, color: '#e53e3e' },
  placeOrderBtn: { background: 'linear-gradient(90deg,#34d399,#10b981)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
  loginNotice: { display: 'flex', alignItems: 'center', gap: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginTop: 12 },
  loginIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: '#e2e8f0', borderRadius: 8 },
  securityBadges: { display: 'flex', gap: 12, marginTop: 12, color: '#475569' },
  securityBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 10px' },
  successIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', marginBottom: 12 },
};
