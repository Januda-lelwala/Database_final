import React, { useMemo, useState } from 'react';
import { ArrowLeft, Package, Search, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TrackOrder(){
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const steps = useMemo(() => (
    [
      { key: 'placed', label: 'Order Placed', icon: <Package size={16}/>, done: true },
      { key: 'shipped', label: 'Shipped', icon: <Truck size={16}/>, done: true },
      { key: 'out', label: 'Out for Delivery', icon: <Truck size={16}/>, done: Math.random() > 0.3 },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={16}/>, done: false },
    ]
  ), []);

  const submit = () => {
    setError('');
    if (!orderId || !email) { setError('Please enter both Order ID and Email'); return; }
    // Mock: any 6+ chars returns a fake timeline
    const ok = orderId.length >= 6;
    if (!ok) { setResult(null); setError('Order not found. Check the ID.'); return; }
    const lastDone = [...steps].reverse().find(s => s.done);
    setResult({ id: orderId.toUpperCase(), eta: '2-3 days', status: lastDone?.label || 'Processing' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Track Your Order</h1>
        <p style={styles.subtitle}>Enter your order details to view delivery status.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Find Order</h3>
          <div style={styles.row}><label style={styles.label}>Order ID</label><input style={styles.input} value={orderId} onChange={(e)=>setOrderId(e.target.value)} placeholder="e.g. KP-123ABC"/></div>
          <div style={styles.row}><label style={styles.label}>Email</label><input style={styles.input} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="your@email.com"/></div>
          {error && <div style={styles.error}><XCircle size={16}/> {error}</div>}
          <button style={styles.btn} onClick={submit}><Search size={16}/> Track Order</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Status</h3>
          {!result && <p style={{color:'#64748b', margin:0}}>Enter details to view status.</p>}
          {result && (
            <div>
              <div style={styles.statusHeader}>
                <div><b>Order:</b> {result.id}</div>
                <div style={{color:'#64748b'}}><b>ETA:</b> {result.eta}</div>
              </div>
              <div style={styles.timeline}>
                {steps.map((s, i) => (
                  <div key={s.key} style={styles.step}>
                    <div style={{...styles.bullet, background: s.done ? '#22c55e' : '#e2e8f0', color: s.done ? '#fff' : '#64748b'}}>
                      {s.icon}
                    </div>
                    <span style={{color: s.done ? '#065f46' : '#475569'}}>{s.label}</span>
                    {i < steps.length - 1 && <div style={{...styles.connector, background: s.done ? 'linear-gradient(90deg,#22c55e,#86efac)' : '#e2e8f0'}}/>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 24 },
  header: { maxWidth: 980, margin: '0 auto 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: 0, color: '#475569' },
  grid: { maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  cardTitle: { marginTop: 0, color: '#111827' },
  row: { display: 'grid', gridTemplateColumns: '1fr', gap: 6, marginBottom: 12 },
  label: { color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0284c7', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
  error: { display:'inline-flex', alignItems:'center', gap:6, background:'#fef2f2', color:'#b91c1c', padding:'6px 10px', borderRadius:10, marginBottom:10 },
  statusHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 10 },
  timeline: { position:'relative', display:'grid', gap: 12, paddingTop: 6 },
  step: { position:'relative', display:'grid', gridTemplateColumns:'auto 1fr', alignItems:'center', gap: 10 },
  bullet: { width: 28, height: 28, borderRadius: 14, display:'inline-flex', alignItems:'center', justifyContent:'center' },
  connector: { height: 2, width: '80%', position:'absolute', left: 34, top: 14, zIndex: 0, opacity: 0.6 },
};
