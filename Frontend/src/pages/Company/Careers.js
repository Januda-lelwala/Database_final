import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Join Our Team</h1>
          <p style={styles.heroSubtitle}>
            Build the future of logistics with us
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.jobsGrid}>
            <div style={styles.jobCard}>
              <h3>Software Engineer</h3>
              <p>Full-time • Remote</p>
              <Link to="/careers/software-engineer" style={styles.applyButton}>Apply Now</Link>
            </div>
            <div style={styles.jobCard}>
              <h3>Product Manager</h3>
              <p>Full-time • San Francisco</p>
              <Link to="/careers/product-manager" style={styles.applyButton}>Apply Now</Link>
            </div>
            <div style={styles.jobCard}>
              <h3>Sales Executive</h3>
              <p>Full-time • New York</p>
              <Link to="/careers/sales-executive" style={styles.applyButton}>Apply Now</Link>
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
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  jobCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  applyButton: {
    background: '#4f46e5',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
  },
};

export default Careers;