import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ordersAPI } from '../services/api';
import {
  ShoppingCart,
  Truck,
  CreditCard,
  ShieldCheck,
  Lock,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { getPlaceholderImage as makePh } from '../utils/placeholder';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, products, removeFromCart, clearCart } = useStore();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [step, setStep] = useState(4); // 1 Cart, 2 Details, 3 Payment, 4 Review
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');

  useEffect(() => {
    // keep step setter referenced to avoid unused var lint in future edits
    setStep((s) => s);
    // Inject keyframes and hover styles once
    if (!document.getElementById('checkout-animations')) {
      const style = document.createElement('style');
      style.id = 'checkout-animations';
      style.innerHTML = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes popIn { 0% { transform: scale(0.95); opacity: 0;} 100% { transform: scale(1); opacity: 1;} }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 0 rgba(102,126,234,0);} 50% { box-shadow: 0 0 0 8px rgba(102,126,234,0.12);} }
        @keyframes progressFill { from { width: 0; } to { width: 100%; } }

        .cart-item:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .summary-card:hover { transform: translateY(-2px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }
        .place-order-btn:hover { transform: translateY(-1px) scale(1.01); box-shadow: 0 10px 24px rgba(56, 178, 172, 0.35); }
        .place-order-btn:active { transform: translateY(0) scale(0.99); }
        .total-value.shimmer { background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(102,126,234,0.15) 50%, rgba(0,0,0,0) 100%); background-size: 200% 100%; animation: shimmer 2.2s infinite; border-radius: 6px; padding: 2px 6px; }
        .progress-rail { position: relative; height: 6px; background: rgba(255,255,255,0.25); border-radius: 999px; overflow: hidden; }
        .progress-fill { position: absolute; left: 0; top: 0; height: 100%; background: linear-gradient(90deg, #a78bfa, #60a5fa); animation: progressFill 1.2s ease-out forwards; }
        .step { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-weight: 600; }
        .step.inactive { opacity: 0.7; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const items = cart.map((ci) => {
    const p = products.find((p) => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = shippingMethod === 'standard'
    ? (subtotal > 100 ? 0 : 15)
    : (subtotal > 200 ? 0 : 25);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onPlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!destinationCity.trim() || !destinationAddress.trim()) {
        throw new Error('Please enter destination city and address');
      }

      if (cart.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Ensure items come from live backend (not seed/demo)
      const hasInvalidIds = cart.some((ci) => {
        const p = products.find((pp) => pp.id === ci.id || pp.product_id === ci.id);
        const pid = p?.product_id ?? p?.id;
        return !p || typeof pid !== 'string' || pid.startsWith('TMP_');
      });
      if (hasInvalidIds) {
        throw new Error('Please add items from the live catalog before placing an order. Reload the Products page and re-add your items.');
      }

      // Build items payload from cart
      const itemsPayload = cart.map((ci) => {
        const p = products.find((pp) => pp.id === ci.id || pp.product_id === ci.id);
        if (!p) {
          throw new Error('One or more cart items are invalid');
        }
        return {
          product_id: p.product_id ?? p.id, // prefer backend id if present
          quantity: ci.qty,
          unit_price: typeof p.price === 'number' ? p.price : Number(p.price) || 0
        };
      });

      // POST to backend
      await ordersAPI.create({
        destination_city: destinationCity,
        destination_address: destinationAddress,
        items: itemsPayload
      });

      // Success UX
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        if (user?.role === 'customer') {
          navigate('/customer');
          window.location.reload(); // Force reload to fetch latest orders
        } else if (user?.role === 'admin' || user?.role === 'driver' || user?.role === 'assistant') {
          navigate('/employee');
          window.location.reload();
        } else {
          navigate('/login');
        }
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
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle2 size={48} color="#22c55e" /></div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successText}>
            Thank you for choosing KandyPack! Your packaging order has been confirmed and will be processed shortly.
          </p>
          <div style={styles.successAnimation}>
            <div style={styles.checkmark}><CheckCircle2 size={28} /></div>
          </div>
          <p style={styles.redirectText}>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Complete Your Order</h1>
        <div style={styles.breadcrumb}>
          <Link to="/products" style={styles.breadcrumbLink}>Packaging Catalog</Link>
          <span style={styles.breadcrumbSeparator}>→</span>
          <span style={styles.breadcrumbCurrent}>Checkout</span>
        </div>
        {/* Progress Steps */}
        <div style={styles.stepsContainer}>
          <div className="step" style={{...styles.step, ...(step < 1 ? styles.stepInactive : {})}}>
            <ShoppingCart size={18} /> Cart
          </div>
          <div className="step" style={{...styles.step, ...(step < 2 ? styles.stepInactive : {})}}>
            <Package size={18} /> Details
          </div>
          <div className="step" style={{...styles.step, ...(step < 3 ? styles.stepInactive : {})}}>
            <CreditCard size={18} /> Payment
          </div>
          <div className="step" style={{...styles.step, ...(step < 4 ? styles.stepInactive : {})}}>
            <ShieldCheck size={18} /> Review
          </div>
        </div>
        <div className="progress-rail" style={styles.progressRail}>
          <div className="progress-fill" style={{...styles.progressFill, width: `${(step-1)/3*100}%`}}></div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Cart Empty State */}
        {items.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={styles.emptyIcon}>🛒</div>
            <h2 style={styles.emptyTitle}>Your cart is empty</h2>
            <p style={styles.emptyText}>Add packaging supplies to your cart to continue</p>
            <Link to="/products" style={styles.continueShoppingBtn}>
              Browse Packaging Catalog
            </Link>
          </div>
        ) : (
          <div style={styles.checkoutGrid}>
            {/* Cart Items */}
            <div style={styles.cartSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Order Summary</h3>
                <span style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Delivery Details */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>Delivery Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#4a5568', marginBottom: 6 }}>Destination City</label>
                    <input
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      placeholder="e.g., Colombo"
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#4a5568', marginBottom: 6 }}>Destination Address</label>
                    <input
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      placeholder="Street, City, Postal Code"
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
                      disabled={processing}
                    />
                  </div>
                </div>
                {error && (
                  <div style={{ marginTop: 12, color: '#e53e3e', fontSize: 14 }}>{error}</div>
                )}
              </div>

              <div style={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.id} style={styles.cartItem} className="cart-item">
                    <div style={styles.itemImage}>
                      <img 
                        src={makePh(item.title?.split(' ')[0] || 'Item', 80, 80, '#4facfe', '#ffffff')}
                        alt={item.title}
                        style={styles.itemImg}
                      />
                    </div>
                    <div style={styles.itemDetails}>
                      <h4 style={styles.itemTitle}>{item.title}</h4>
                      <p style={styles.itemCategory}>{item.category}</p>
                      <div style={styles.itemQuantity}>
                        <span>Quantity: {item.qty}</span>
                        <span style={styles.itemPrice}>${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div style={styles.itemActions}>
                      <div style={styles.itemTotal}>${item.lineTotal.toFixed(2)}</div>
                      <button 
                        style={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id)}
                        disabled={processing}
                      >
                        <Trash2 size={14} style={{marginRight: 6}}/> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                style={styles.clearCartBtn} 
                onClick={clearCart}
                disabled={processing}
              >
                <Trash2 size={14} style={{marginRight: 6}}/> Clear Cart
              </button>
            </div>

            {/* Order Total & Actions */}
            <div style={styles.summarySection}>
              <div style={styles.summaryCard} className="summary-card">
                <h3 style={styles.summaryTitle}>Payment Summary</h3>
                
                {/* Shipping Method */}
                <div style={styles.shipMethods}>
                  <button
                    onClick={() => setShippingMethod('standard')}
                    style={{
                      ...styles.shipBtn,
                      ...(shippingMethod === 'standard' ? styles.shipBtnActive : {})
                    }}
                  >
                    <Truck size={16} style={{marginRight: 8}}/> Standard
                  </button>
                  <button
                    onClick={() => setShippingMethod('express')}
                    style={{
                      ...styles.shipBtn,
                      ...(shippingMethod === 'express' ? styles.shipBtnActive : {})
                    }}
                  >
                    <Truck size={16} style={{marginRight: 8}}/> Express
                  </button>
                </div>

                <div style={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span className="total-value shimmer">${subtotal.toFixed(2)}</span>
                </div>
                
                <div style={styles.summaryLine}>
                  <span>Shipping</span>
                  <span style={shipping === 0 ? styles.freeShipping : {}}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div style={styles.summaryLine}>
                  <span>Tax</span>
                  <span className="total-value shimmer">${tax.toFixed(2)}</span>
                </div>
                
                <div style={styles.summaryDivider}></div>
                
                <div style={styles.summaryTotal}>
                  <span>Total</span>
                  <span className="total-value shimmer">${total.toFixed(2)}</span>
                </div>

                {subtotal < 100 && (
                  <div style={styles.shippingNotice}>
                    <Truck size={14} style={{marginRight: 6}}/> Add ${(100 - subtotal).toFixed(2)} more for free standard shipping!
                  </div>
                )}

                {!user && (
                  <div style={styles.loginNotice}>
                    <span style={styles.loginIcon}><Lock size={20}/></span>
                    <div>
                      <p style={styles.loginText}>Please sign in to continue</p>
                      <Link to="/login" style={styles.loginBtn}>Sign In</Link>
                    </div>
                  </div>
                )}

                <button 
                  className="place-order-btn"
                  style={{
                    ...styles.placeOrderBtn,
                    ...((!user || processing) ? styles.placeOrderBtnDisabled : {})
                  }}
                  onClick={onPlaceOrder}
                  disabled={!user || processing}
                >
                  {processing ? (
                    <>
                      <span style={styles.spinner}></span>
                      Processing Your Order...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} style={{marginRight: 6}}/>
                      Place Order
                      <ArrowRight size={18} style={{marginLeft: 6}}/>
                    </>
                  )}
                </button>

                <div style={styles.securityBadges}>
                  <span style={styles.securityBadge}><ShieldCheck size={14} style={{marginRight: 6}}/> Secure Checkout</span>
                  <span style={styles.securityBadge}><Lock size={14} style={{marginRight: 6}}/> SSL Protected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f6f8fb',
    padding: '28px 16px',
  },
  header: {
    textAlign: 'center',
    margin: '0 auto 20px auto',
    color: '#0f172a',
    background: 'white',
    border: '1px solid #eaeef3',
    borderRadius: '14px',
    padding: '18px 22px',
    maxWidth: '1100px',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    margin: '0 0 10px 0',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: 0.95,
    marginBottom: '8px'
  },
  breadcrumbLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontWeight: 600
  },
  breadcrumbSeparator: {
    opacity: 0.6,
    color: '#94a3b8'
  },
  breadcrumbCurrent: {
    fontWeight: 700,
    color: '#0f172a'
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
    gap: '10px',
    marginTop: '14px',
    alignItems: 'center',
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '999px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#334155',
    fontWeight: 600
  },
  stepInactive: {
    opacity: 0.6,
  },
  progressRail: {
    marginTop: '10px',
    width: '100%',
    height: '6px',
    borderRadius: '999px',
    background: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  emptyCart: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px 36px',
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    margin: '0 0 12px 0',
  },
  emptyText: {
    color: '#64748b',
    marginBottom: '24px',
  },
  continueShoppingBtn: {
    display: 'inline-block',
    padding: '12px 20px',
    background: '#0ea5e9',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    boxShadow: '0 8px 24px rgba(14,165,233,0.25)'
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  cartSection: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
    border: '1px solid #eaeef3'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    margin: 0,
  },
  itemCount: {
    color: '#718096',
    fontSize: '14px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    border: '1px solid #eaeef3',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    background: '#ffffff',
    boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
    animation: 'fadeSlideIn 0.3s ease',
  },
  itemImage: {
    flexShrink: 0,
  },
  itemImg: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '1rem',
    color: '#2d3748',
    margin: '0 0 4px 0',
  },
  itemCategory: {
    color: '#718096',
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  itemQuantity: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#4a5568',
  },
  itemPrice: {
    fontWeight: '600',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
  },
  itemTotal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e53e3e',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  clearCartBtn: {
    padding: '10px 20px',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  summarySection: {
    alignSelf: 'flex-start',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
    border: '1px solid #eaeef3',
    position: 'sticky',
    top: '20px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  summaryTitle: {
    fontSize: '1.3rem',
    color: '#2d3748',
    margin: '0 0 24px 0',
  },
  shipMethods: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '14px',
  },
  shipBtn: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#f9fafb',
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  shipBtnActive: {
    borderColor: '#667eea',
    background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    color: '#4338ca',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.25)',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    color: '#4a5568',
  },
  freeShipping: {
    color: '#38a169',
    fontWeight: '600',
  },
  summaryDivider: {
    height: '1px',
    background: '#e2e8f0',
    margin: '16px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '16px',
  },
  shippingNotice: {
    backgroundColor: '#eef2ff',
    color: '#4338ca',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '16px',
    boxShadow: '0 6px 14px rgba(67,56,202,0.1)',
  },
  loginNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fef5e7',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  loginIcon: {
    fontSize: '24px',
  },
  loginText: {
    color: '#744210',
    margin: '0 0 8px 0',
    fontSize: '14px',
  },
  loginBtn: {
    color: '#d69e2e',
    textDecoration: 'none',
    fontWeight: '600',
  },
  placeOrderBtn: {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 20px rgba(56,178,172,0.35)',
  },
  placeOrderBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  orderIcon: {
    fontSize: '18px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
    marginRight: '8px',
  },
  securityBadges: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '8px',
  },
  securityBadge: {
    fontSize: '12px',
    color: '#718096',
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '100px auto',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '1.8rem',
    color: '#2d3748',
    margin: '0 0 16px 0',
  },
  successText: {
    color: '#718096',
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  successAnimation: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  checkmark: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    animation: 'checkmarkPulse 1.5s ease-in-out infinite',
  },
  redirectText: {
    color: '#718096',
    fontSize: '14px',
    margin: 0,
  },
};

export default Checkout;
