import React from 'react';
import { ArrowLeft, CheckCircle2, Download, Package, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PackagingHelp(){
  const steps = [
    { title: 'Choose the right box', desc: 'Select a sturdy box with enough room for cushioning material.', icon: <Package size={16}/> },
    { title: 'Protect fragile items', desc: 'Wrap each item individually with bubble wrap or paper.', icon: <Shield size={16}/> },
    { title: 'Fill empty space', desc: 'Use packing peanuts or crumpled paper to minimize movement.', icon: <CheckCircle2 size={16}/> },
    { title: 'Seal securely', desc: 'Tape all seams with strong packing tape. Label clearly.', icon: <CheckCircle2 size={16}/> },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Packaging Help</h1>
        <p style={styles.subtitle}>Follow these steps to pack and ship safely.</p>
      </div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Step-by-step guide</h3>
          <ol style={{margin:'6px 0 0 18px', color:'#475569'}}>
            {steps.map((s, i)=> (
              <li key={i} style={{marginBottom: 8}}>
                <div style={{display:'inline-flex', alignItems:'center', gap:8}}>{s.icon} <b>{s.title}</b></div>
                <div>{s.desc}</div>
              </li>
            ))}
          </ol>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resources</h3>
          <ul style={{margin:'6px 0 0 18px', color:'#475569'}}>
            <li>Printable shipping labels (PDF).</li>
            <li>Fragile stickers and handling instructions.</li>
            <li>Eco-friendly packaging recommendations.</li>
          </ul>
          <button style={styles.btn}><Download size={16}/> Download Label Template</button>
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
  grid: { maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  cardTitle: { marginTop: 0, color: '#111827' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer', marginTop: 10 },
};
