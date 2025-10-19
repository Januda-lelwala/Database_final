import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { ShoppingCart, Package, CreditCard, ShieldCheck } from 'lucide-react';

const steps = [
  { key: 'cart', label: 'Cart', icon: ShoppingCart },
  { key: 'details', label: 'Details', icon: Package },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ShieldCheck },
];

export default function CheckoutLayout() {
  const location = useLocation();
  const match = location.pathname.match(/checkout\/(cart|details|payment|review)/);
  const active = match ? match[1] : null;

  const stepIndex = steps.findIndex(s => s.key === active);

  // Inject minimal global styles for interactivity/animations once
  useEffect(() => {
    if (!document.getElementById('checkout-shared-styles')) {
      const style = document.createElement('style');
      style.id = 'checkout-shared-styles';
      style.innerHTML = `
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        @keyframes cc-pop { 0% { transform: scale(0.98); opacity: 0.7;} 100% { transform: scale(1); opacity: 1;} }
        @keyframes cc-shimmer { 0% { background-position: -200% 0;} 100% { background-position: 200% 0;} }
        .cc-card { animation: cc-pop .25s ease-out; transition: box-shadow .2s, transform .2s; }
        .cc-card:hover { transform: translateY(-1px); box-shadow: 0 16px 40px rgba(0,0,0,.12); }
        .cc-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 10px; padding: 10px 14px; transition: transform .15s, box-shadow .2s, background .2s; }
        .cc-btn:active { transform: translateY(0); }
        .cc-btn-primary { background: linear-gradient(90deg,#34d399,#10b981); color: #fff; border: none; }
        .cc-btn-primary:hover { box-shadow: 0 10px 24px rgba(16,185,129,.35); transform: translateY(-1px) scale(1.01); }
        .cc-btn-ghost { background: #fee2e2; border: 1px solid #fecaca; color: #b91c1c; }
        .cc-btn-ghost:hover { background: #fecaca; }
        .cc-input { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #cbd5e1; transition: box-shadow .2s, border-color .2s; }
        .cc-input:focus { outline: none; border-color: #818cf8; box-shadow: 0 0 0 4px rgba(129,140,248,.25); }
        .cc-chip { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 999px; }
        .cc-total-shimmer { background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(102,126,234,0.15) 50%, rgba(0,0,0,0) 100%); background-size: 200% 100%; animation: cc-shimmer 2.2s infinite; border-radius: 6px; padding: 2px 6px; }
        .cc-radio { border: 1px solid #c7d2fe; background: #eef2ff; border-radius: 12px; padding: 10px 12px; cursor: pointer; }
        .cc-radio[aria-pressed="true"] { background: #e0e7ff; border-color: #a5b4fc; box-shadow: 0 0 0 2px rgba(165,180,252,.3) inset; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!active) return <Navigate to="/checkout/cart" replace />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Complete Your Order</h1>
        <div style={styles.breadcrumb}>
          <Link to="/products" style={styles.breadcrumbLink}>Packaging Catalog</Link>
          <span style={styles.breadcrumbSeparator}>→</span>
          <span style={styles.breadcrumbCurrent}>Checkout</span>
        </div>
        <div style={styles.stepsContainer}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const inactive = i > stepIndex;
            const path = `/checkout/${s.key}`;
            const content = (
              <div style={{...styles.step, ...(inactive ? styles.stepInactive : {}), ...(i === stepIndex ? styles.stepActive : {})}}>
                <Icon size={18} /> {s.label}
              </div>
            );
            // Allow navigating to current or previous steps; block jumping to future steps
            return (
              <div key={s.key}>
                {i <= stepIndex ? <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link> : content}
              </div>
            );
          })}
        </div>
        <div style={styles.progressRail}>
          <div style={{...styles.progressFill, width: `${(stepIndex/3)*100}%`}} />
        </div>
      </div>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20 },
  header: { textAlign: 'center', marginBottom: 30, color: 'white' },
  title: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 16px 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' },
  breadcrumb: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.9 },
  breadcrumbLink: { color: 'white', textDecoration: 'underline' },
  breadcrumbSeparator: { opacity: 0.8 },
  breadcrumbCurrent: { opacity: 0.95 },
  stepsContainer: { display: 'flex', gap: 16, justifyContent: 'center', fontWeight: 600 },
  step: { display: 'flex', alignItems: 'center', gap: 8 },
  stepInactive: { opacity: 0.6 },
  progressRail: { height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #a78bfa, #60a5fa)' },
  content: { marginTop: 20 }
};
