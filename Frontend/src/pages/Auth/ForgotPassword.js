import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.successHeader}>
            <div style={styles.successIcon}>✅</div>
            <h1 style={styles.successTitle}>Check Your Email</h1>
            <p style={styles.successSubtitle}>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div style={styles.successContent}>
            <div style={styles.instructionBox}>
              <h3 style={styles.instructionTitle}>What's next?</h3>
              <ul style={styles.instructionList}>
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Create a new password</li>
                <li>Sign in with your new password</li>
              </ul>
            </div>

            <div style={styles.actionButtons}>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                style={styles.resendButton}
              >
                Resend Email
              </button>
              <Link to="/login" style={styles.backToLoginButton}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🔑</span>
          </div>
          <h1 style={styles.title}>Forgot Password</h1>
          <p style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={styles.input}
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Sending Instructions...
              </>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Remember your password? 
            <Link to="/login" style={styles.link}> Sign In</Link>
          </p>
          <p style={styles.footerText}>
            Need additional help? 
            <Link to="/need-help" style={styles.link}> Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  formContainer: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  iconContainer: {
    marginBottom: '20px',
  },
  icon: {
    fontSize: '3rem',
    display: 'inline-block',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '50%',
    color: 'white',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.5',
  },
  form: {
    marginBottom: '20px',
  },
  inputGroup: {
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
    ':focus': {
      borderColor: '#667eea',
      outline: 'none',
    },
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    background: '#fee2e2',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  errorIcon: {
    marginRight: '8px',
    fontSize: '1.2rem',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '0.9rem',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '10px',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  // Success styles
  successHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  successTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: '10px',
  },
  successSubtitle: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.5',
  },
  successContent: {
    marginBottom: '20px',
  },
  instructionBox: {
    background: '#f0f9ff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  instructionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  instructionList: {
    color: '#555',
    lineHeight: '1.6',
    paddingLeft: '20px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column',
  },
  resendButton: {
    padding: '12px 20px',
    fontSize: '0.9rem',
    color: '#667eea',
    background: 'transparent',
    border: '2px solid #667eea',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  backToLoginButton: {
    padding: '12px 20px',
    fontSize: '0.9rem',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'transform 0.2s ease',
  },
};