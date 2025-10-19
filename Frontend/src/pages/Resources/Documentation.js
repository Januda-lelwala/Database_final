import React from 'react';
import { Link } from 'react-router-dom';

const Documentation = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Documentation</h1>
          <p style={styles.heroSubtitle}>
            Technical documentation and API references for developers
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.docsGrid}>
            <div style={styles.docCard}>
              <h3>API Documentation</h3>
              <p>Complete API reference and examples</p>
              <Link to="/docs/api" style={styles.viewDocs}>View API Docs</Link>
            </div>
            <div style={styles.docCard}>
              <h3>Integration Guides</h3>
              <p>Step-by-step integration tutorials</p>
              <Link to="/docs/integrations" style={styles.viewDocs}>View Guides</Link>
            </div>
            <div style={styles.docCard}>
              <h3>SDK Reference</h3>
              <p>Software development kits and libraries</p>
              <Link to="/docs/sdk" style={styles.viewDocs}>View SDK</Link>
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
  docsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  docCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  viewDocs: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Documentation;