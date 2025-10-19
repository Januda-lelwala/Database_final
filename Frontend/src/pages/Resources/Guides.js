import React from 'react';
import { Link } from 'react-router-dom';

const Guides = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Implementation Guides</h1>
          <p style={styles.heroSubtitle}>
            Step-by-step guides to help you optimize your logistics operations
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.guidesGrid}>
            <div style={styles.guideCard}>
              <h3>Getting Started with KandyPack</h3>
              <p>Complete setup guide for new users</p>
              <Link to="/guides/getting-started" style={styles.viewGuide}>View Guide</Link>
            </div>
            <div style={styles.guideCard}>
              <h3>Fleet Management Best Practices</h3>
              <p>Optimize your fleet operations</p>
              <Link to="/guides/fleet-management" style={styles.viewGuide}>View Guide</Link>
            </div>
            <div style={styles.guideCard}>
              <h3>Supply Chain Visibility</h3>
              <p>Achieve end-to-end transparency</p>
              <Link to="/guides/supply-chain-visibility" style={styles.viewGuide}>View Guide</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'white',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    opacity: '0.9',
  },
  content: {
    padding: '4rem 2rem',
    background: 'white',
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  guidesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  guideCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  viewGuide: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Guides;