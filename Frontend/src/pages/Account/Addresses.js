import React, { useState } from 'react';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Addresses(){
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', line: '123 Main St, City', default: true },
  ]);
  const [label, setLabel] = useState('');
  const [line, setLine] = useState('');

  const addAddress = () => {
    if (!label || !line) return;
    setAddresses((prev) => [{ id: Date.now(), name: label, line, default: false }, ...prev]);
    setLabel(''); setLine('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Shipping Addresses</h1>
        <p style={styles.subtitle}>Manage and add shipping locations.</p>
      </div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Addresses</h3>
          <div style={styles.list}>
            {addresses.map(a => (
              <div key={a.id} style={styles.addr}>
                <span style={{display:'inline-flex',alignItems:'center',gap:6}}><MapPin size={14}/> <b>{a.name}</b></span>
                <span style={{color:'#64748b'}}>{a.line}</span>
                {a.default && <span style={styles.default}>Default</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add New</h3>
          <div style={styles.row}><label style={styles.label}>Label</label><input style={styles.input} value={label} onChange={(e)=>setLabel(e.target.value)} placeholder="Home, Office, etc"/></div>
          <div style={styles.row}><label style={styles.label}>Address</label><input style={styles.input} value={line} onChange={(e)=>setLine(e.target.value)} placeholder="Street, City, Postcode"/></div>
          <button style={styles.save} onClick={addAddress}><Plus size={16}/> Add Address</button>
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
  list: { display: 'grid', gap: 10 },
  addr: { display: 'grid', gridTemplateColumns: '1fr 2fr auto', alignItems: 'center', gap: 8, borderBottom: '1px solid #e2e8f0', padding: '8px 0' },
  default: { background: '#ecfeff', color: '#0891b2', padding: '2px 6px', borderRadius: 10, fontWeight: 700 },
  row: { display: 'grid', gridTemplateColumns: '1fr', gap: 6, marginBottom: 12 },
  label: { color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  save: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#667eea', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
};
