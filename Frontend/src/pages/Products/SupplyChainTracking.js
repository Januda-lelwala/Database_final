import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SupplyChainTracking = () => {
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Supply Chain Tracking</h1>
          <p style={styles.heroSubtitle}>
            Real-time visibility and control over your entire supply chain network
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>Get Started</Link>
            <Link to="/demo" style={styles.secondaryButton}>Watch Demo</Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.trackingVisual}>
            <div style={styles.trackingNode}>📦</div>
            <div style={styles.trackingLine}></div>
            <div style={styles.trackingNode}>🚛</div>
            <div style={styles.trackingLine}></div>
            <div style={styles.trackingNode}>🏪</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Advanced Tracking Capabilities</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📍</div>
              <h3 style={styles.featureTitle}>Real-Time Location</h3>
              <p style={styles.featureDescription}>
                Track your shipments with GPS precision. Get instant updates on location, speed, and estimated arrival times.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Analytics Dashboard</h3>
              <p style={styles.featureDescription}>
                Comprehensive insights into delivery performance, route optimization, and supply chain efficiency.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔔</div>
              <h3 style={styles.featureTitle}>Smart Alerts</h3>
              <p style={styles.featureDescription}>
                Proactive notifications for delays, route changes, and delivery confirmations to keep you informed.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>Secure Chain</h3>
              <p style={styles.featureDescription}>
                End-to-end encryption and blockchain verification ensure your supply chain data is secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Why Choose KandyPack Tracking?</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>99.9% Accuracy</h4>
              <p style={styles.benefitDescription}>Industry-leading tracking precision</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>24/7 Monitoring</h4>
              <p style={styles.benefitDescription}>Round-the-clock supply chain visibility</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>Cost Reduction</h4>
              <p style={styles.benefitDescription}>Average 25% reduction in logistics costs</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>Fast Implementation</h4>
              <p style={styles.benefitDescription}>Setup in less than 48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Supply Chain?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of companies already using KandyPack for superior supply chain tracking
          </p>
          <Link to="/signup" style={styles.ctaButton}>Start Free Trial</Link>
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
    padding: '6rem 2rem 4rem',
    display: 'flex',
    alignItems: 'center',
    minHeight: '70vh',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
    color: 'white',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '2.5rem',
    opacity: '0.9',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  ctaButton: {
    background: 'white',
    color: '#4f46e5',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'all 0.3s ease',
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingVisual: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  trackingNode: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: '1rem',
    backdropFilter: 'blur(10px)',
  },
  trackingLine: {
    width: '4rem',
    height: '4px',
    background: 'white',
    borderRadius: '2px',
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
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  featureDescription: {
    color: '#64748b',
    lineHeight: '1.6',
  },
  benefits: {
    padding: '6rem 2rem',
    background: '#f8fafc',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  benefitItem: {
    textAlign: 'center',
    padding: '2rem',
  },
  benefitTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: '0.5rem',
  },
  benefitDescription: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  cta: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  ctaContent: {
    maxWidth: '600px',
    margin: '0 auto',
    color: 'white',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  ctaSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: '0.9',
  },
};

export default SupplyChainTracking;