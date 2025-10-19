import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Logistics = () => {
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Logistics Solutions</h1>
          <p style={styles.heroSubtitle}>
            End-to-end logistics management with AI-powered optimization and real-time visibility
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>Get Started</Link>
            <Link to="/demo" style={styles.secondaryButton}>View Solutions</Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.logisticsVisual}>
            <div style={styles.warehouseIcon}>🏭</div>
            <div style={styles.arrowIcon}>➡️</div>
            <div style={styles.truckIcon}>🚛</div>
            <div style={styles.arrowIcon}>➡️</div>
            <div style={styles.deliveryIcon}>📦</div>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section style={styles.solutions}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Comprehensive Logistics Management</h2>
          <div style={styles.solutionsGrid}>
            <div style={styles.solutionCard}>
              <div style={styles.solutionIcon}>📊</div>
              <h3 style={styles.solutionTitle}>Supply Chain Visibility</h3>
              <p style={styles.solutionDescription}>
                Real-time tracking and monitoring across your entire supply chain network with complete transparency.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <div style={styles.solutionIcon}>🗺️</div>
              <h3 style={styles.solutionTitle}>Route Optimization</h3>
              <p style={styles.solutionDescription}>
                AI-driven route planning to minimize costs, reduce delivery times, and maximize efficiency.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <div style={styles.solutionIcon}>📦</div>
              <h3 style={styles.solutionTitle}>Warehouse Management</h3>
              <p style={styles.solutionDescription}>
                Automated inventory management, order processing, and warehouse optimization systems.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <div style={styles.solutionIcon}>🚚</div>
              <h3 style={styles.solutionTitle}>Fleet Operations</h3>
              <p style={styles.solutionDescription}>
                Complete fleet management including vehicle tracking, maintenance, and driver management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section style={styles.benefits}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Transform Your Logistics Operations</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>40% Cost Reduction</h4>
              <p style={styles.benefitDescription}>Optimize operations and reduce logistics costs</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>99% On-Time Delivery</h4>
              <p style={styles.benefitDescription}>Improve customer satisfaction with reliable delivery</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>Real-Time Tracking</h4>
              <p style={styles.benefitDescription}>Complete visibility across your supply chain</p>
            </div>
            <div style={styles.benefitItem}>
              <h4 style={styles.benefitTitle}>Automated Workflows</h4>
              <p style={styles.benefitDescription}>Streamline processes with intelligent automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section style={styles.industries}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Logistics Solutions by Industry</h2>
          <div style={styles.industriesGrid}>
            <div style={styles.industryCard}>
              <h4 style={styles.industryTitle}>E-commerce & Retail</h4>
              <p style={styles.industryDescription}>
                Last-mile delivery optimization, inventory management, and customer experience enhancement.
              </p>
            </div>
            <div style={styles.industryCard}>
              <h4 style={styles.industryTitle}>Manufacturing</h4>
              <p style={styles.industryDescription}>
                Raw material procurement, production logistics, and finished goods distribution.
              </p>
            </div>
            <div style={styles.industryCard}>
              <h4 style={styles.industryTitle}>Food & Beverage</h4>
              <p style={styles.industryDescription}>
                Cold chain management, freshness tracking, and regulatory compliance.
              </p>
            </div>
            <div style={styles.industryCard}>
              <h4 style={styles.industryTitle}>Healthcare</h4>
              <p style={styles.industryDescription}>
                Medical supply chain, pharmaceutical distribution, and temperature-controlled logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Optimize Your Logistics?</h2>
          <p style={styles.ctaSubtitle}>
            Join leading companies using KandyPack for superior logistics management
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
  logisticsVisual: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  warehouseIcon: {
    fontSize: '3.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  truckIcon: {
    fontSize: '3.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  deliveryIcon: {
    fontSize: '3.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
  },
  arrowIcon: {
    fontSize: '2rem',
    color: 'white',
  },
  solutions: {
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
  solutionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  solutionCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
  },
  solutionIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  solutionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  solutionDescription: {
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
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  benefitTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: '0.5rem',
  },
  benefitDescription: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  industries: {
    padding: '6rem 2rem',
    background: 'white',
  },
  industriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  industryCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  industryTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  industryDescription: {
    color: '#64748b',
    lineHeight: '1.6',
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

export default Logistics;