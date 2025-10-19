import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>KandyPack Blog</h1>
          <p style={styles.heroSubtitle}>
            Latest insights, trends, and best practices in supply chain and logistics
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Recent Articles</h2>
          <div style={styles.articlesGrid}>
            <article style={styles.articleCard}>
              <h3>The Future of Supply Chain Automation</h3>
              <p>Exploring how AI and robotics are transforming logistics operations...</p>
              <Link to="/blog/supply-chain-automation" style={styles.readMore}>Read More</Link>
            </article>
            <article style={styles.articleCard}>
              <h3>Sustainable Logistics Practices</h3>
              <p>How companies are reducing their environmental footprint through green logistics...</p>
              <Link to="/blog/sustainable-logistics" style={styles.readMore}>Read More</Link>
            </article>
            <article style={styles.articleCard}>
              <h3>Route Optimization Strategies</h3>
              <p>Best practices for optimizing delivery routes and reducing costs...</p>
              <Link to="/blog/route-optimization" style={styles.readMore}>Read More</Link>
            </article>
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
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#1e293b',
  },
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  articleCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  readMore: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Blog;