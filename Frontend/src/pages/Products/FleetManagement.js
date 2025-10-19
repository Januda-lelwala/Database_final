import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FleetManagement = () => {
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Fleet Management</h1>
          <p style={styles.heroSubtitle}>
            Comprehensive fleet operations management with AI-powered insights and automation
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>Get Started</Link>
            <Link to="/demo" style={styles.secondaryButton}>Schedule Demo</Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.fleetVisual}>
            <div style={styles.vehicle}>🚛</div>
            <div style={styles.vehicle}>🚚</div>
            <div style={styles.vehicle}>🚐</div>
            <div style={styles.controlCenter}>🏢</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Complete Fleet Control</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🚗</div>
              <h3 style={styles.featureTitle}>Vehicle Tracking</h3>
              <p style={styles.featureDescription}>
                Real-time GPS tracking with detailed vehicle history, maintenance schedules, and performance metrics.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⛽</div>
              <h3 style={styles.featureTitle}>Fuel Management</h3>
              <p style={styles.featureDescription}>
                Monitor fuel consumption, detect fraud, and optimize routes to reduce operational costs.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>👥</div>
              <h3 style={styles.featureTitle}>Driver Management</h3>
              <p style={styles.featureDescription}>
                Track driver behavior, manage work hours, and ensure compliance with safety regulations.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔧</div>
              <h3 style={styles.featureTitle}>Maintenance Alerts</h3>
              <p style={styles.featureDescription}>
                Proactive maintenance scheduling and alerts to prevent breakdowns and extend vehicle life.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📋</div>
              <h3 style={styles.featureTitle}>Compliance Tracking</h3>
              <p style={styles.featureDescription}>
                Automated compliance monitoring for DOT regulations, HOS, and safety requirements.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🗺️</div>
              <h3 style={styles.featureTitle}>Route Optimization</h3>
              <p style={styles.featureDescription}>
                AI-powered route planning to minimize costs, reduce travel time, and improve efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.stats}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Proven Results</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>30%</div>
              <div style={styles.statLabel}>Fuel Cost Reduction</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>50%</div>
              <div style={styles.statLabel}>Fewer Breakdowns</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>95%</div>
              <div style={styles.statLabel}>Compliance Rate</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Fleet Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section style={styles.solutions}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Fleet Solutions for Every Industry</h2>
          <div style={styles.solutionsGrid}>
            <div style={styles.solutionCard}>
              <h4 style={styles.solutionTitle}>Logistics & Transportation</h4>
              <p style={styles.solutionDescription}>
                Optimize delivery routes, manage driver schedules, and ensure on-time deliveries.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <h4 style={styles.solutionTitle}>Construction</h4>
              <p style={styles.solutionDescription}>
                Track heavy equipment, manage site operations, and ensure safety compliance.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <h4 style={styles.solutionTitle}>Field Services</h4>
              <p style={styles.solutionDescription}>
                Dispatch efficiency, real-time technician tracking, and customer communication.
              </p>
            </div>
            <div style={styles.solutionCard}>
              <h4 style={styles.solutionTitle}>Delivery Services</h4>
              <p style={styles.solutionDescription}>
                Last-mile optimization, proof of delivery, and customer satisfaction tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Transform Your Fleet Operations</h2>
          <p style={styles.ctaSubtitle}>
            Join over 10,000 fleet managers who trust KandyPack for their operations
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
  fleetVisual: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'center',
  },
  vehicle: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  controlCenter: {
    fontSize: '4rem',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '1rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    gridColumn: 'span 2',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
  stats: {
    padding: '6rem 2rem',
    background: '#f8fafc',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
  },
  statItem: {
    textAlign: 'center',
    padding: '2rem',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  solutions: {
    padding: '6rem 2rem',
    background: 'white',
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
    border: '1px solid #e2e8f0',
  },
  solutionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  solutionDescription: {
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

export default FleetManagement;