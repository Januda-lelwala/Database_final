import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EquipmentMonitoring = () => {
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Equipment Monitoring</h1>
          <p style={styles.heroSubtitle}>
            Advanced IoT monitoring and predictive maintenance for all your industrial equipment
          </p>
          <div style={styles.heroButtons}>
            <Link to="/signup" style={styles.ctaButton}>Start Monitoring</Link>
            <Link to="/demo" style={styles.secondaryButton}>View Demo</Link>
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.monitoringVisual}>
            <div style={styles.equipmentIcon}>⚙️</div>
            <div style={styles.sensorLine}></div>
            <div style={styles.equipmentIcon}>📡</div>
            <div style={styles.sensorLine}></div>
            <div style={styles.equipmentIcon}>📊</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Advanced Monitoring Capabilities</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📡</div>
              <h3 style={styles.featureTitle}>IoT Sensors</h3>
              <p style={styles.featureDescription}>
                Real-time monitoring with advanced IoT sensors for temperature, vibration, pressure, and more.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔧</div>
              <h3 style={styles.featureTitle}>Predictive Maintenance</h3>
              <p style={styles.featureDescription}>
                AI-powered predictions to prevent equipment failures and optimize maintenance schedules.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>⚠️</div>
              <h3 style={styles.featureTitle}>Real-time Alerts</h3>
              <p style={styles.featureDescription}>
                Instant notifications for equipment anomalies, maintenance needs, and performance issues.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Performance Analytics</h3>
              <p style={styles.featureDescription}>
                Comprehensive analytics dashboard for equipment performance, utilization, and efficiency metrics.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🛠️</div>
              <h3 style={styles.featureTitle}>Maintenance Tracking</h3>
              <p style={styles.featureDescription}>
                Complete maintenance history and scheduling system for all your equipment.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📱</div>
              <h3 style={styles.featureTitle}>Mobile Access</h3>
              <p style={styles.featureDescription}>
                Monitor your equipment from anywhere with our mobile-friendly dashboard and app.
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
              <div style={styles.statNumber}>40%</div>
              <div style={styles.statLabel}>Maintenance Cost Reduction</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>85%</div>
              <div style={styles.statLabel}>Equipment Uptime</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>1000+</div>
              <div style={styles.statLabel}>Monitored Assets</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={styles.benefits}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Why Choose Our Equipment Monitoring?</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitItem}>
              <h3 style={styles.benefitTitle}>Prevent Equipment Failures</h3>
              <p style={styles.benefitDescription}>
                Proactive monitoring prevents costly breakdowns and extends equipment lifespan.
              </p>
            </div>
            <div style={styles.benefitItem}>
              <h3 style={styles.benefitTitle}>Optimize Maintenance Schedules</h3>
              <p style={styles.benefitDescription}>
                Data-driven maintenance scheduling reduces costs and improves efficiency.
              </p>
            </div>
            <div style={styles.benefitItem}>
              <h3 style={styles.benefitTitle}>Improve Safety Standards</h3>
              <p style={styles.benefitDescription}>
                Early detection of equipment issues ensures safer operations across your facility.
              </p>
            </div>
            <div style={styles.benefitItem}>
              <h3 style={styles.benefitTitle}>Maximize Asset ROI</h3>
              <p style={styles.benefitDescription}>
                Better equipment utilization and longer asset life improve return on investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.sectionContent}>
          <h2 style={styles.ctaTitle}>Ready to Monitor Your Equipment?</h2>
          <p style={styles.ctaDescription}>
            Start monitoring your industrial equipment today with our advanced IoT platform.
          </p>
          <Link to="/signup" style={styles.ctaButton}>Get Started Now</Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    color: 'white',
    padding: '100px 20px',
    display: 'flex',
    alignItems: 'center',
    minHeight: '60vh',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
    marginRight: '50px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '30px',
    opacity: 0.9,
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  ctaButton: {
    background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid white',
    transition: 'all 0.3s ease',
  },
  heroImage: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monitoringVisual: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  equipmentIcon: {
    fontSize: '4rem',
    animation: 'pulse 2s infinite',
  },
  sensorLine: {
    width: '50px',
    height: '3px',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '2px',
  },
  features: {
    padding: '100px 20px',
    backgroundColor: '#f8f9fa',
  },
  sectionContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '60px',
    color: '#333',
    fontWeight: 'bold',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  featureDescription: {
    color: '#666',
    lineHeight: '1.6',
  },
  stats: {
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    textAlign: 'center',
  },
  statItem: {
    padding: '20px',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '1.1rem',
    opacity: 0.9,
  },
  benefits: {
    padding: '100px 20px',
    backgroundColor: 'white',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  benefitItem: {
    textAlign: 'center',
    padding: '30px',
  },
  benefitTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  benefitDescription: {
    color: '#666',
    lineHeight: '1.6',
  },
  cta: {
    padding: '80px 20px',
    background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
    color: 'white',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  ctaDescription: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    opacity: 0.9,
  },
};

export default EquipmentMonitoring;