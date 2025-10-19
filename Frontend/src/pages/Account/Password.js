import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Password(){
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const onSave = () => {
    if (!next || next !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    setMsg('Password updated successfully.');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Security</h1>
        <p style={styles.subtitle}>Update your password regularly to keep your account safe.</p>
      </div>

      <div style={styles.card}>
        <div style={styles.row}><label style={styles.label}><KeyRound size={16}/> Current Password</label><input type="password" style={styles.input} value={current} onChange={e=>setCurrent(e.target.value)} /></div>
        <div style={styles.row}><label style={styles.label}><KeyRound size={16}/> New Password</label><input type="password" style={styles.input} value={next} onChange={e=>setNext(e.target.value)} /></div>
        <div style={styles.row}><label style={styles.label}><KeyRound size={16}/> Confirm New Password</label><input type="password" style={styles.input} value={confirm} onChange={e=>setConfirm(e.target.value)} /></div>
        <button style={styles.save} onClick={onSave}><Save size={16}/> Save Password</button>
        {msg && <div style={styles.msg}>{msg}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 24 },
  header: { maxWidth: 760, margin: '0 auto 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: 0, color: '#475569' },
  card: { maxWidth: 760, margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  row: { display: 'grid', gridTemplateColumns: '1fr', gap: 6, marginBottom: 12 },
  label: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#334155', fontWeight: 600 },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  save: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#667eea', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
  msg: { marginTop: 10, fontWeight: 700, color: '#0ea5e9' },
};
