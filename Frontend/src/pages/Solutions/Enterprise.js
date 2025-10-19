import React from 'react';
import { Link } from 'react-router-dom';

const Enterprise = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Enterprise Solutions</h1>
          <p style={styles.heroSubtitle}>
            Scalable enterprise-grade logistics and supply chain management platform
          </p>
          <Link to="/signup" style={styles.ctaButton}>Get Started</Link>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Enterprise-Grade Features</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <h3>Multi-Location Management</h3>
              <p>Manage operations across multiple facilities and regions</p>
            </div>
            <div style={styles.featureCard}>
              <h3>Advanced Analytics</h3>
              <p>Business intelligence and predictive analytics</p>
            </div>
            <div style={styles.featureCard}>
              <h3>Custom Integrations</h3>
              <p>Seamless integration with existing enterprise systems</p>
            </div>
            <div style={styles.featureCard}>
              <h3>24/7 Support</h3>
              <p>Dedicated enterprise support and account management</p>
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
    padding: '6rem 2rem',
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
    marginBottom: '1.5rem',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '2rem',
    opacity: '0.9',
  },
  ctaButton: {
    background: 'white',
    color: '#4f46e5',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
  },
  features: {
    padding: '6rem 2rem',
    background: 'white',
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#1e293b',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
};

export default Enterprise;