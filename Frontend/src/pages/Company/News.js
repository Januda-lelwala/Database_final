import React from 'react';

const News = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Company News</h1>
          <p style={styles.heroSubtitle}>
            Latest updates and announcements from KandyPack
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.newsGrid}>
            <article style={styles.newsCard}>
              <h3>KandyPack Raises $50M Series B</h3>
              <p>Company expands operations with new funding round...</p>
              <span style={styles.date}>March 15, 2025</span>
            </article>
            <article style={styles.newsCard}>
              <h3>New AI Features Launched</h3>
              <p>Advanced analytics and predictive capabilities now available...</p>
              <span style={styles.date}>February 28, 2025</span>
            </article>
            <article style={styles.newsCard}>
              <h3>Partnership with Global Logistics Leader</h3>
              <p>Strategic partnership to enhance supply chain solutions...</p>
              <span style={styles.date}>January 20, 2025</span>
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
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  newsCard: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  date: {
    color: '#64748b',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
};

export default News;