import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile(){
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('customer@kandypack.com');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!document.getElementById('account-animations')) {
      const style = document.createElement('style');
      style.id = 'account-animations';
      style.innerHTML = `
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .card { animation: fadeUp 0.25s ease; }
        .btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(102,126,234,0.2); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const onSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}> 
        <Link to="/customer" style={styles.backLink}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.subtitle}>Keep your account details up to date.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card} className="card">
          <h3 style={styles.cardTitle}>Basic Info</h3>
          <div style={styles.formRow}>
            <label style={styles.label}><User size={16}/> Full Name</label>
            <input style={styles.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name"/>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}><Mail size={16}/> Email</label>
            <input style={styles.input} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@email.com"/>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}><Phone size={16}/> Phone</label>
            <input style={styles.input} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(+94) 77 123 4567"/>
          </div>
          <div style={styles.formRow}>
            <label style={styles.label}><MapPin size={16}/> Address</label>
            <textarea style={{...styles.input, height: 90}} value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Street, City, Postcode"/>
          </div>
          <button className="btn" style={styles.saveBtn} onClick={onSave} disabled={saving}>
            <Save size={16}/>
            {saving ? ' Saving...' : ' Save Changes'}
          </button>
          {saved && <div style={styles.saved}>Saved!</div>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: '24px' },
  header: { maxWidth: 980, margin: '0 auto 16px' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: 0, color: '#475569' },
  grid: { maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  cardTitle: { marginTop: 0, color: '#111827' },
  formRow: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 },
  label: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', outline: 'none' },
  saveBtn: { display: 'inline-flex', gap: 6, alignItems: 'center', border: 'none', background: '#667eea', color: '#fff', padding: '10px 14px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' },
  saved: { marginTop: 10, color: '#10b981', fontWeight: 700 },
};
