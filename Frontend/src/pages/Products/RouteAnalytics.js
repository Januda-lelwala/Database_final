import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RouteAnalytics = () => {
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Route Analytics</h1>
          <p style={styles.heroSubtitle}>
            AI-powered route optimization and performance analytics for maximum efficiency
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>Get Started</Link>
            <Link to="/demo" style={styles.secondaryButton}>View Analytics</Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.analyticsVisual}>
            <div style={styles.chartContainer}>
              <div style={styles.chart}>📊</div>
              <div style={styles.mapIcon}>🗺️</div>
              <div style={styles.routeIcon}>🛣️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Advanced Route Intelligence</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎯</div>
              <h3 style={styles.featureTitle}>Route Optimization</h3>
              <p style={styles.featureDescription}>
                AI algorithms analyze traffic patterns, road conditions, and delivery schedules to find the most efficient routes.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📈</div>
              <h3 style={styles.featureTitle}>Performance Metrics</h3>
              <p style={styles.featureDescription}>
                Comprehensive analytics on delivery times, fuel consumption, driver performance, and customer satisfaction.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🚦</div>
              <h3 style={styles.featureTitle}>Traffic Intelligence</h3>
              <p style={styles.featureDescription}>
                Real-time traffic analysis and predictive routing to avoid congestion and minimize delays.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>Dynamic Routing</h3>
              <p style={styles.featureDescription}>
                Automatic route adjustments based on live conditions, urgent deliveries, and operational changes.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💰</div>
              <h3 style={styles.featureTitle}>Cost Analysis</h3>
              <p style={styles.featureDescription}>
                Detailed breakdown of route costs including fuel, labor, vehicle wear, and operational expenses.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📱</div>
              <h3 style={styles.featureTitle}>Mobile Dashboard</h3>
              <p style={styles.featureDescription}>
                Access route analytics and optimization tools from anywhere with our mobile-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Demo Section */}
      <section style={styles.demo}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Real-Time Analytics Dashboard</h2>
          <div style={styles.demoGrid}>
            <div style={styles.demoCard}>
              <h4 style={styles.demoTitle}>Route Efficiency</h4>
              <div style={styles.demoMetric}>92%</div>
              <p style={styles.demoDescription}>Average route efficiency improvement</p>
            </div>
            <div style={styles.demoCard}>
              <h4 style={styles.demoTitle}>Fuel Savings</h4>
              <div style={styles.demoMetric}>28%</div>
              <p style={styles.demoDescription}>Reduction in fuel consumption</p>
            </div>
            <div style={styles.demoCard}>
              <h4 style={styles.demoTitle}>On-Time Delivery</h4>
              <div style={styles.demoMetric}>97%</div>
              <p style={styles.demoDescription}>Improved delivery performance</p>
            </div>
            <div style={styles.demoCard}>
              <h4 style={styles.demoTitle}>Cost Reduction</h4>
              <div style={styles.demoMetric}>35%</div>
              <p style={styles.demoDescription}>Overall operational savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Transform Your Operations</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <h4 style={styles.benefitTitle}>Reduce Costs</h4>
              <p style={styles.benefitDescription}>
                Optimize routes to minimize fuel consumption, reduce vehicle wear, and lower operational expenses.
              </p>
            </div>
            <div style={styles.benefitCard}>
              <h4 style={styles.benefitTitle}>Improve Service</h4>
              <p style={styles.benefitDescription}>
                Enhance customer satisfaction with accurate delivery estimates and reliable on-time performance.
              </p>
            </div>
            <div style={styles.benefitCard}>
              <h4 style={styles.benefitTitle}>Increase Efficiency</h4>
              <p style={styles.benefitDescription}>
                Streamline operations with automated route planning and real-time optimization capabilities.
              </p>
            </div>
            <div style={styles.benefitCard}>
              <h4 style={styles.benefitTitle}>Scale Operations</h4>
              <p style={styles.benefitDescription}>
                Handle more deliveries with the same resources through intelligent route optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Optimize Your Routes Today</h2>
          <p style={styles.ctaSubtitle}>
            Start saving time and money with AI-powered route analytics
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
  analyticsVisual: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'center',
  },
  chart: {
    fontSize: '4rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    gridColumn: 'span 2',
  },
  mapIcon: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  routeIcon: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
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
  demo: {
    padding: '6rem 2rem',
    background: '#f8fafc',
  },
  demoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  },
  demoCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  demoTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  demoMetric: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: '0.5rem',
  },
  demoDescription: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  benefits: {
    padding: '6rem 2rem',
    background: 'white',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  benefitCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  benefitTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  benefitDescription: {
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

export default RouteAnalytics;