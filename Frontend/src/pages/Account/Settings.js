import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Shield, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Settings(){
  const { theme, setTheme } = useTheme();
  const [dark, setDark] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => {
    if (!document.getElementById('settings-animations')) {
      const style = document.createElement('style');
      style.id = 'settings-animations';
      style.innerHTML = `
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .card { animation: fadeUp 0.25s ease; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    setDark(theme === 'dark');
  }, [theme]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Control preferences for your account.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card} className="card">
          <h3 style={styles.cardTitle}>Preferences</h3>
          <label style={styles.toggle}><span style={styles.icon}>{dark ? <Moon size={16}/> : <Sun size={16}/>}</span> Dark Mode
            <input type="checkbox" checked={dark} onChange={(e)=>{ const v = e.target.checked; setDark(v); setTheme(v ? 'dark' : 'light'); }} />
          </label>
          <label style={styles.toggle}><span style={styles.icon}><Bell size={16}/></span> Order Alerts
            <input type="checkbox" checked={alerts} onChange={(e)=>setAlerts(e.target.checked)} />
          </label>
          <label style={styles.toggle}><span style={styles.icon}><Shield size={16}/></span> 2FA
            <input type="checkbox" checked={twoFA} onChange={(e)=>setTwoFA(e.target.checked)} />
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: 24 },
  header: { maxWidth: 980, margin: '0 auto 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: 'var(--text)' },
  subtitle: { margin: 0, color: 'var(--muted)' },
  grid: { maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' },
  cardTitle: { marginTop: 0, color: 'var(--text)' },
  toggle: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600 },
  icon: { display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: 8 },
};
