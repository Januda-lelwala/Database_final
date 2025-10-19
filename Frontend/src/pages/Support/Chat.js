import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Chat(){
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Canned bot reply after a short delay
    setTimeout(() => {
      const botMsg = { id: Date.now()+1, from: 'bot', text: 'Thanks! A support agent will join shortly. Meanwhile, you can track orders or start a return from the Support menu.' };
      setMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/customer" style={styles.back}><ArrowLeft size={16}/> Back to Dashboard</Link>
        <h1 style={styles.title}>Live Chat</h1>
        <p style={styles.subtitle}>We respond in a few minutes.</p>
      </div>
      <div style={styles.card}>
        <div style={styles.messages}>
          {messages.map(m => (
            <div key={m.id} style={{...styles.msg, justifyContent: m.from==='user' ? 'flex-end' : 'flex-start'}}>
              {m.from==='bot' && <div style={{...styles.bubble, background:'#eef2ff', color:'#3730a3'}}><Bot size={14}/> {m.text}</div>}
              {m.from==='user' && <div style={{...styles.bubble, background:'#0ea5e9', color:'#fff'}}>{m.text}</div>}
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div style={styles.inputBar}>
          <input style={styles.input} value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type your message..." onKeyDown={(e)=>{ if(e.key==='Enter') send(); }}/>
          <button style={styles.send} onClick={send}><Send size={16}/> Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: 24 },
  header: { maxWidth: 800, margin: '0 auto 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', textDecoration: 'none', fontWeight: 600 },
  title: { margin: '8px 0 4px', fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: 0, color: '#475569' },
  card: { maxWidth: 800, margin: '0 auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'grid', gridTemplateRows: '1fr auto' },
  messages: { height: '56vh', overflowY: 'auto', padding: 16, display:'grid', gap: 8 },
  msg: { display:'flex' },
  bubble: { display:'inline-flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius: 14, maxWidth:'70%' },
  inputBar: { display:'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0' },
  input: { border: '2px solid #e2e8f0', borderRadius: 12, padding: '10px 12px' },
  send: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
};
