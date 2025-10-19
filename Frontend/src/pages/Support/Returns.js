import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Send, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Returns(){
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('Damaged item');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    if (!orderId) { setError('Please enter your Order ID'); return; }
    setSubmitted(true);
    setTimeout(()=> setSubmitted(false), 4000);
    setOrderId(''); setDetails('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Start a Return</h1>
        <p style={styles.subtitle}>Request a return or refund in a few steps.</p>
      </div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}><RotateCcw size={16}/> Return Request</h3>
          <div style={styles.row}><label style={styles.label}>Order ID</label><input style={styles.input} value={orderId} onChange={(e)=>setOrderId(e.target.value)} placeholder="e.g. KP-123ABC"/></div>
          <div style={styles.row}>
            <label style={styles.label}>Reason</label>
            <select style={styles.input} value={reason} onChange={(e)=>setReason(e.target.value)}>
              <option>Damaged item</option>
              <option>Wrong item received</option>
              <option>Missing parts</option>
              <option>Not as described</option>
              <option>Changed my mind</option>
            </select>
          </div>
          <div style={styles.row}><label style={styles.label}>Details</label><textarea rows={4} style={{...styles.input, resize:'vertical'}} value={details} onChange={(e)=>setDetails(e.target.value)} placeholder="Tell us more to help us improve"/></div>
          {error && <div style={styles.error}><XCircle size={16}/> {error}</div>}
          <button style={styles.btn} onClick={submit}><Send size={16}/> Submit Request</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}><CheckCircle2 size={16}/> Policy Highlights</h3>
          <ul style={{margin:'6px 0 0 18px', color:'#475569'}}>
            <li>Returns accepted within 30 days of delivery.</li>
            <li>Items must be unused and in original packaging.</li>
            <li>Prepaid label provided for approved requests.</li>
            <li>Refunds processed within 5-7 business days after inspection.</li>
          </ul>
        </div>
      </div>
      {submitted && (
        <div style={styles.toast}><CheckCircle2 size={16}/> Return request received! We emailed you next steps.</div>
      )}
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
  cardTitle: { marginTop: 0, color: '#111827', display:'inline-flex', alignItems:'center', gap:8 },
  row: { display: 'grid', gridTemplateColumns: '1fr', gap: 6, marginBottom: 12 },
  label: { color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
  error: { display:'inline-flex', alignItems:'center', gap:6, background:'#fef2f2', color:'#b91c1c', padding:'6px 10px', borderRadius:10, marginBottom:10 },
  toast: { position:'fixed', left:'50%', bottom:20, transform:'translateX(-50%)', background:'#10b981', color:'#fff', padding:'10px 14px', borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,0.15)', fontWeight:700 }
};
