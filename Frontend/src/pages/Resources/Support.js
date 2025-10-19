import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Customer Support</h1>
          <p style={styles.heroSubtitle}>
            Get help when you need it with our comprehensive support resources
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.supportGrid}>
            <div style={styles.supportCard}>
              <h3>24/7 Live Chat</h3>
              <p>Get instant help from our support team</p>
              <button style={styles.contactButton}>Start Chat</button>
            </div>
            <div style={styles.supportCard}>
              <h3>Knowledge Base</h3>
              <p>Find answers to common questions</p>
              <Link to="/support/kb" style={styles.contactButton}>Browse Articles</Link>
            </div>
            <div style={styles.supportCard}>
              <h3>Submit Ticket</h3>
              <p>Report issues or request assistance</p>
              <Link to="/support/ticket" style={styles.contactButton}>Create Ticket</Link>
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
  supportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  supportCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  contactButton: {
    background: '#4f46e5',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
  },
};

export default Support;