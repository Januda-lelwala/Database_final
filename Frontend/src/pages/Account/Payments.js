import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Payments(){
  const [cards, setCards] = useState([
    { id: 1, brand: 'Visa', last4: '4242', name: 'Personal', exp: '12/27', default: true },
  ]);
  const [brand, setBrand] = useState('Visa');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [exp, setExp] = useState('');

  const addCard = () => {
    if (!number || number.replace(/\D/g,'').length < 12 || !exp) return;
    const last4 = number.slice(-4);
    setCards(prev => [{ id: Date.now(), brand, last4, name: name || brand, exp, default: prev.length === 0 }, ...prev]);
    setName(''); setNumber(''); setExp('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Payment Methods</h1>
        <p style={styles.subtitle}>Manage your saved cards.</p>
      </div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Saved Cards</h3>
          <div style={{display:'grid', gap:10}}>
            {cards.map(c => (
              <div key={c.id} style={styles.cardRow}>
                <div style={{display:'inline-flex', alignItems:'center', gap:8}}>
                  <CreditCard size={18}/> <b>{c.brand}</b> •••• {c.last4}
                </div>
                <div style={{color:'#64748b'}}>{c.name} · Expires {c.exp}</div>
                {c.default && <span style={styles.default}>Default</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add New Card</h3>
          <div style={styles.row}>
            <label style={styles.label}>Brand</label>
            <select style={styles.input} value={brand} onChange={(e)=>setBrand(e.target.value)}>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>Amex</option>
              <option>Discover</option>
            </select>
          </div>
          <div style={styles.row}><label style={styles.label}>Name</label><input style={styles.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Card label (optional)"/></div>
          <div style={styles.row}><label style={styles.label}>Number</label><input style={styles.input} value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="1234 5678 9012 3456"/></div>
          <div style={styles.row}><label style={styles.label}>Expiry</label><input style={styles.input} value={exp} onChange={(e)=>setExp(e.target.value)} placeholder="MM/YY"/></div>
          <button style={styles.save} onClick={addCard}><Plus size={16}/> Add Card</button>
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
  cardRow: { display:'grid', gridTemplateColumns: '1fr 2fr auto', alignItems:'center', gap:8, borderBottom:'1px solid #e2e8f0', padding:'8px 0' },
  default: { background: '#ecfeff', color: '#0891b2', padding: '2px 6px', borderRadius: 10, fontWeight: 700 },
  row: { display: 'grid', gridTemplateColumns: '1fr', gap: 6, marginBottom: 12 },
  label: { color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  save: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
};