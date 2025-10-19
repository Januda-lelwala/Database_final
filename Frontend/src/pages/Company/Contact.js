import React from 'react';

const Contact = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Contact Us</h1>
          <p style={styles.heroSubtitle}>
            Get in touch with our team
          </p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.sectionContent}>
          <div style={styles.contactGrid}>
            <div style={styles.contactInfo}>
              <h3>Get in Touch</h3>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Email:</strong> contact@kandypack.com</p>
              <p><strong>Address:</strong> 123 Logistics Lane, Supply City, SC 12345</p>
            </div>
            <div style={styles.contactForm}>
              <form style={styles.form}>
                <input type="text" placeholder="Your Name" style={styles.input} />
                <input type="email" placeholder="Your Email" style={styles.input} />
                <textarea placeholder="Your Message" style={styles.textarea}></textarea>
                <button type="submit" style={styles.submitButton}>Send Message</button>
              </form>
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
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
  },
  contactInfo: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  contactForm: {
    background: '#f8fafc',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
  },
  submitButton: {
    background: '#4f46e5',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default Contact;