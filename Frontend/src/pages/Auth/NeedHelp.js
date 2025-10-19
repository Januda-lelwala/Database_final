import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NeedHelp() {
  const [selectedCategory, setSelectedCategory] = useState('account');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const helpCategories = {
    account: {
      title: 'Account Issues',
      icon: '👤',
      items: [
        { question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page and follow the email instructions.' },
        { question: 'How do I update my account information?', answer: 'Go to your profile settings in the dashboard and edit your details.' },
        { question: 'Why can\'t I access my account?', answer: 'Check your credentials or contact support if your account is locked.' },
        { question: 'How do I change my email address?', answer: 'Contact support to securely update your email address.' }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: '🔧',
      items: [
        { question: 'The system is running slowly', answer: 'Clear your browser cache, check internet connection, or try a different browser.' },
        { question: 'I\'m getting error messages', answer: 'Take a screenshot of the error and contact our technical support team.' },
        { question: 'Features are not working properly', answer: 'Ensure you\'re using a supported browser and have the latest updates.' },
        { question: 'How do I report a bug?', answer: 'Use the contact form below with detailed steps to reproduce the issue.' }
      ]
    },
    billing: {
      title: 'Billing & Payments',
      icon: '💳',
      items: [
        { question: 'How do I view my billing history?', answer: 'Access your billing section in the account dashboard.' },
        { question: 'How do I update payment methods?', answer: 'Go to billing settings and add or update your payment information.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, bank transfers, and PayPal.' },
        { question: 'How do I cancel my subscription?', answer: 'Contact billing support or use the cancellation option in your account.' }
      ]
    },
    services: {
      title: 'Services & Features',
      icon: '🚚',
      items: [
        { question: 'How do I track my shipments?', answer: 'Use the tracking dashboard to monitor all rail and road shipments in real-time.' },
        { question: 'How do I optimize my routes?', answer: 'Access the Route Analytics page for AI-powered optimization recommendations.' },
        { question: 'How do I manage my fleet?', answer: 'Use the Fleet Management dashboard to monitor and control your vehicles.' },
        { question: 'How do I set up equipment monitoring?', answer: 'Go to Equipment Monitoring and follow the setup wizard for IoT sensors.' }
      ]
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Help & Support</h1>
          <p style={styles.subtitle}>
            Get help with your Rail & Road Supply Chain Distribution System
          </p>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <Link to="/forgot-password" style={styles.quickActionCard}>
            <div style={styles.quickActionIcon}>🔑</div>
            <h3>Reset Password</h3>
            <p>Can't access your account?</p>
          </Link>
          
          <Link to="/login" style={styles.quickActionCard}>
            <div style={styles.quickActionIcon}>🔐</div>
            <h3>Back to Login</h3>
            <p>Ready to sign in?</p>
          </Link>

          <a href="tel:+1-800-RAIL-ROAD" style={styles.quickActionCard}>
            <div style={styles.quickActionIcon}>📞</div>
            <h3>Call Support</h3>
            <p>+1-800-RAIL-ROAD</p>
          </a>
        </div>

        {/* Help Categories */}
        <div style={styles.helpSection}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          
          {/* Category Tabs */}
          <div style={styles.categoryTabs}>
            {Object.entries(helpCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  ...styles.categoryTab,
                  ...(selectedCategory === key ? styles.categoryTabActive : {})
                }}
              >
                <span style={styles.categoryIcon}>{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          <div style={styles.faqContent}>
            <h3 style={styles.categoryTitle}>
              {helpCategories[selectedCategory].icon} {helpCategories[selectedCategory].title}
            </h3>
            <div style={styles.faqList}>
              {helpCategories[selectedCategory].items.map((item, index) => (
                <div key={index} style={styles.faqItem}>
                  <h4 style={styles.question}>{item.question}</h4>
                  <p style={styles.answer}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.contactSection}>
          <h2 style={styles.sectionTitle}>Still Need Help?</h2>
          <p style={styles.contactDescription}>
            Can't find what you're looking for? Send us a message and our support team will get back to you.
          </p>

          {submitted ? (
            <div style={styles.successMessage}>
              <div style={styles.successIcon}>✅</div>
              <h3>Message Sent Successfully!</h3>
              <p>Our support team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} style={styles.contactForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  style={styles.input}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="account">Account Issues</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Questions</option>
                  <option value="services">Service Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  style={{...styles.input, height: '120px', resize: 'vertical'}}
                  placeholder="Describe your issue or question in detail..."
                  required
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Emergency Contact */}
        <div style={styles.emergencySection}>
          <h3 style={styles.emergencyTitle}>🚨 Emergency Support</h3>
          <p style={styles.emergencyText}>
            For urgent issues affecting your operations:
          </p>
          <div style={styles.emergencyContacts}>
            <a href="tel:+1-800-EMERGENCY" style={styles.emergencyContact}>
              📞 Emergency Hotline: +1-800-EMERGENCY
            </a>
            <a href="mailto:emergency@railroad-logistics.com" style={styles.emergencyContact}>
              ✉️ Emergency Email: emergency@railroad-logistics.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    lineHeight: '1.6',
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  quickActionCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#333',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  },
  quickActionIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  helpSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '30px',
    justifyContent: 'center',
  },
  categoryTab: {
    padding: '12px 20px',
    border: '2px solid #e1e5e9',
    borderRadius: '25px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryTabActive: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    borderColor: '#667eea',
  },
  categoryIcon: {
    fontSize: '1.2rem',
  },
  faqContent: {
    marginTop: '20px',
  },
  categoryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  faqItem: {
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '10px',
    borderLeft: '4px solid #667eea',
  },
  question: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  answer: {
    color: '#666',
    lineHeight: '1.6',
  },
  contactSection: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  contactDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: '1.1rem',
  },
  contactForm: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '1rem',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  successMessage: {
    textAlign: 'center',
    padding: '40px',
    background: '#f0f9ff',
    borderRadius: '15px',
    border: '2px solid #16a34a',
  },
  successIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  emergencySection: {
    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    border: '2px solid #f87171',
  },
  emergencyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '15px',
  },
  emergencyText: {
    color: '#991b1b',
    marginBottom: '20px',
  },
  emergencyContacts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  emergencyContact: {
    color: '#dc2626',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    padding: '10px 20px',
    background: 'white',
    borderRadius: '10px',
    border: '2px solid #dc2626',
    transition: 'all 0.3s ease',
  },
};