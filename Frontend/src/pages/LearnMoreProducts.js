import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShieldCheck, Truck, Recycle, Layers, Star, ArrowRight } from 'lucide-react';

export default function LearnMoreProducts() {
  useEffect(() => {
    if (!document.getElementById('learn-more-animations')) {
      const style = document.createElement('style');
      style.id = 'learn-more-animations';
      style.innerHTML = `
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes float { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12);} 
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(59,130,246,0.35);} 
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}><span style={styles.heroAccent}>Packaging</span> that moves with you</h1>
          <p style={styles.heroSubtitle}>From rail to road, we design, test, and deliver packaging engineered for performance and sustainability.</p>
          <div style={styles.heroCtas}>
            <Link to="/products" style={{...styles.ctaBtn, ...styles.ctaPrimary}} className="cta-btn">
              Browse Products <ArrowRight size={16} style={{marginLeft: 8}}/>
            </Link>
            <a href="#features" style={{...styles.ctaBtn, ...styles.ctaGhost}} className="cta-btn">Explore Features</a>
          </div>
        </div>
        <div style={styles.heroDecor} aria-hidden="true">
          <div style={styles.blobA}></div>
          <div style={styles.blobB}></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle}>Why choose KandyPack</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: <ShieldCheck size={24}/>, title: 'Tested Durability', text: 'Drop-tested and vibration-qualified to protect your payload end-to-end.' },
            { icon: <Truck size={24}/>, title: 'Multi-Modal Ready', text: 'Optimized for hand-off between rail and road logistics with minimal repack.' },
            { icon: <Recycle size={24}/>, title: 'Sustainable Materials', text: 'Recycled fibers, low-VOC inks, and returnable tote options.' },
            { icon: <Layers size={24}/>, title: 'Custom Fit', text: 'Foam-in-place, die-cut inserts, and ESD-safe liners tailored to your SKU.' },
            { icon: <Star size={24}/>, title: 'Quality Assured', text: 'ISO-aligned processes and incoming QC on every batch.' },
            { icon: <Package size={24}/>, title: 'Fast Lead Times', text: 'Distributed manufacturing reduces cycle times and shipping miles.' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard} className="feature-card">
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.bottomCta}>
        <h2 style={styles.bottomTitle}>Ready to spec your packaging?</h2>
        <p style={styles.bottomText}>Explore our catalog or talk to our solution engineers for tailored recommendations.</p>
        <div style={styles.bottomButtons}>
          <Link to="/products" style={{...styles.ctaBtn, ...styles.ctaPrimary}} className="cta-btn">
            Go to Catalog <ArrowRight size={16} style={{marginLeft: 8}}/>
          </Link>
          <Link to="/auth" style={{...styles.ctaBtn, ...styles.ctaGhost}} className="cta-btn">
            Talk to an Expert
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  hero: {
    position: 'relative',
    padding: 'clamp(48px, 12vh, 96px) 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    overflow: 'hidden',
  },
  heroInner: { maxWidth: 960, margin: '0 auto', textAlign: 'center' },
  heroTitle: { fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, margin: 0 },
  heroAccent: {
    background: 'linear-gradient(90deg, #f9fafb, #e0e7ff, #dbeafe)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: { maxWidth: 760, margin: '16px auto 0', opacity: 0.95, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' },
  heroCtas: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', padding: '12px 16px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' },
  ctaPrimary: { background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)', color: 'white', boxShadow: '0 8px 20px rgba(96,165,250,0.35)' },
  ctaGhost: { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' },
  heroDecor: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  blobA: { position: 'absolute', width: 260, height: 260, left: -80, top: -80, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0))', filter: 'blur(6px)', animation: 'float 12s ease-in-out infinite' },
  blobB: { position: 'absolute', width: 220, height: 220, right: -60, bottom: -60, borderRadius: '50%', background: 'radial-gradient(circle at 70% 40%, rgba(255,255,255,0.2), rgba(255,255,255,0))', filter: 'blur(6px)', animation: 'float 14s ease-in-out infinite', animationDelay: '0.5s' },

  features: { maxWidth: 1100, margin: '0 auto', padding: '48px 16px' },
  sectionTitle: { textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: 24 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  featureCard: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18, animation: 'fadeUp 0.4s ease', transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
  featureIcon: { width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#eef2ff', color: '#4338ca', marginBottom: 10 },
  featureTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', margin: '8px 0' },
  featureText: { color: '#475569', fontSize: 14, lineHeight: 1.5 },

  bottomCta: { textAlign: 'center', padding: '56px 16px' },
  bottomTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 },
  bottomText: { color: '#64748b', marginTop: 8, marginBottom: 18 },
  bottomButtons: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
};
