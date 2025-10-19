import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Add floating bubble animations
const bubbleAnimations = `
<style>
@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes floatLeft {
  0% {
    transform: translateX(100vw) translateY(50vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateX(-10vw) translateY(-10vh) rotate(180deg);
    opacity: 0;
  }
}

.floating-bubble {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(1px);
}

.bubble-1 {
  width: 60px;
  height: 60px;
  left: 10%;
  animation: floatUp 15s infinite linear;
  animation-delay: 0s;
}

.bubble-2 {
  width: 40px;
  height: 40px;
  left: 20%;
  animation: floatUp 18s infinite linear;
  animation-delay: 2s;
}

.bubble-3 {
  width: 30px;
  height: 30px;
  left: 35%;
  animation: floatUp 20s infinite linear;
  animation-delay: 4s;
}

.bubble-4 {
  width: 50px;
  height: 50px;
  left: 50%;
  animation: floatUp 16s infinite linear;
  animation-delay: 6s;
}

.bubble-5 {
  width: 35px;
  height: 35px;
  left: 65%;
  animation: floatUp 22s infinite linear;
  animation-delay: 8s;
}

.bubble-6 {
  width: 45px;
  height: 45px;
  left: 80%;
  animation: floatUp 17s infinite linear;
  animation-delay: 10s;
}

.bubble-7 {
  width: 25px;
  height: 25px;
  left: 90%;
  animation: floatUp 19s infinite linear;
  animation-delay: 12s;
}

.bubble-8 {
  width: 55px;
  height: 55px;
  top: 20%;
  animation: floatLeft 14s infinite linear;
  animation-delay: 1s;
}

.bubble-9 {
  width: 32px;
  height: 32px;
  top: 60%;
  animation: floatLeft 21s infinite linear;
  animation-delay: 5s;
}

.bubble-10 {
  width: 42px;
  height: 42px;
  top: 80%;
  animation: floatLeft 18s infinite linear;
  animation-delay: 9s;
}
</style>
`;

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    mobileNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Email validation (only if email is provided)
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
    }

    try {
      // Prepare data for backend API (matching backend field names)
      const registrationData = {
        name: formData.name,
        user_name: formData.username,
        password: formData.password,
        phone_no: formData.mobileNo,
        city: formData.city,
        address: formData.address
      };

      // Call the registration API
      const newUser = await register(registrationData);
      
      setSuccess(`Account created successfully! Welcome ${newUser.name}!`);
      setTimeout(() => {
        navigate('/customer'); // Redirect to customer dashboard after successful registration
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inject bubble animations CSS */}
      <div dangerouslySetInnerHTML={{ __html: bubbleAnimations }} />
      
      {/* Floating Bubbles */}
      <div className="floating-bubble bubble-1"></div>
      <div className="floating-bubble bubble-2"></div>
      <div className="floating-bubble bubble-3"></div>
      <div className="floating-bubble bubble-4"></div>
      <div className="floating-bubble bubble-5"></div>
      <div className="floating-bubble bubble-6"></div>
      <div className="floating-bubble bubble-7"></div>
      <div className="floating-bubble bubble-8"></div>
      <div className="floating-bubble bubble-9"></div>
      <div className="floating-bubble bubble-10"></div>

      <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🎉</span>
          </div>
          <h1 style={styles.title}>Join KandyPack Business Network</h1>
          <p style={styles.subtitle}>Create your business account for packaging supplies</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (optional)"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Business address"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Business city"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1, marginLeft: '12px'}}>
              <label style={styles.label}>Mobile No</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                placeholder="Business contact number"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                style={styles.input}
                disabled={loading}
              />
            </div>
            <div style={{...styles.inputGroup, flex: 1, marginLeft: '12px'}}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {success && (
            <div style={styles.successContainer}>
              <span style={styles.successIcon}>✅</span>
              <span style={styles.successText}>{success}</span>
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? 
            <Link to="/login" style={styles.link}> Sign In</Link>
          </p>
          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 5vw, 1.25rem)',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 'clamp(0.75rem, 3vw, 1.25rem)',
    padding: 'clamp(1.5rem, 8vw, 2.5rem)',
    boxShadow: '0 clamp(0.75rem, 2vw, 1.25rem) clamp(1.5rem, 4vw, 2.5rem) rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 'clamp(20rem, 90vw, 37.5rem)',
    minWidth: '18rem',
    textAlign: 'center',
    margin: 'auto',
  },
  header: {
    marginBottom: 'clamp(1.25rem, 5vh, 1.875rem)',
  },
  iconContainer: {
    marginBottom: 'clamp(0.75rem, 3vh, 1rem)',
  },
  icon: {
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
  },
  title: {
    fontSize: 'clamp(1.25rem, 5vw, 1.8rem)',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0 0 clamp(0.375rem, 2vh, 0.5rem) 0',
    lineHeight: '1.3',
  },
  subtitle: {
    color: '#718096',
    margin: 0,
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    lineHeight: '1.5',
  },
  form: {
    textAlign: 'left',
  },
  row: {
    display: 'flex',
    marginBottom: 'clamp(1rem, 4vh, 1.25rem)',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      gap: '0',
    },
  },
  inputGroup: {
    flex: 1,
    minWidth: 'clamp(8rem, 40vw, 12rem)',
  },
  label: {
    display: 'block',
    marginBottom: 'clamp(0.25rem, 1vh, 0.375rem)',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
  },
  input: {
    width: '100%',
    padding: 'clamp(0.5rem, 3vw, 0.75rem) clamp(0.75rem, 4vw, 1rem)',
    border: '2px solid #e2e8f0',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: 'clamp(2.5rem, 8vw, 3rem)',
    ':focus': {
      borderColor: '#f5576c',
      boxShadow: '0 0 0 3px rgba(245, 87, 108, 0.1)',
    },
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.375rem, 2vw, 0.5rem)',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: 'clamp(0.5rem, 3vw, 0.75rem) clamp(0.75rem, 4vw, 1rem)',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    marginBottom: 'clamp(1rem, 4vh, 1.25rem)',
    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
    flexWrap: 'wrap',
  },
  successContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.375rem, 2vw, 0.5rem)',
    backgroundColor: '#c6f6d5',
    color: '#276749',
    padding: 'clamp(0.5rem, 3vw, 0.75rem) clamp(0.75rem, 4vw, 1rem)',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    marginBottom: 'clamp(1rem, 4vh, 1.25rem)',
    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
    flexWrap: 'wrap',
  },
  errorIcon: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
  },
  successIcon: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
  },
  errorText: {
    margin: 0,
    lineHeight: '1.4',
  },
  successText: {
    margin: 0,
    lineHeight: '1.4',
  },
  submitButton: {
    width: '100%',
    padding: 'clamp(0.75rem, 4vw, 0.875rem) clamp(1rem, 5vw, 1.5rem)',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 'clamp(0.375rem, 2vw, 0.5rem)',
    fontSize: 'clamp(0.875rem, 3.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(0.375rem, 2vw, 0.5rem)',
    marginBottom: 'clamp(1rem, 5vh, 1.5rem)',
    minHeight: 'clamp(2.75rem, 8vw, 3.25rem)',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
  spinner: {
    width: 'clamp(0.875rem, 3vw, 1rem)',
    height: 'clamp(0.875rem, 3vw, 1rem)',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
    margin: '0 0 clamp(0.375rem, 2vh, 0.5rem) 0',
    lineHeight: '1.5',
  },
  link: {
    color: '#f5576c',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  backLink: {
    color: '#f5576c',
    textDecoration: 'none',
    fontSize: 'clamp(0.8rem, 3vw, 0.875rem)',
    marginTop: 'clamp(0.75rem, 3vh, 1rem)',
    display: 'inline-block',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

// Enhanced responsive CSS styles for comprehensive screen size support
const signupPageStyles = `
  /* CSS animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Mobile First: Base styles for 320px+ */
  @media screen and (min-width: 320px) {
    .signup-container {
      padding: 1rem;
    }
    .signup-form-container {
      padding: 1.5rem;
      margin: 0 auto;
    }
    .signup-row {
      flex-direction: column;
      gap: 0;
    }
    .signup-input-group {
      margin-bottom: 1rem;
    }
    .signup-input {
      font-size: 16px; /* Prevent zoom on iOS */
    }
  }

  /* Small Mobile: 375px+ */
  @media screen and (min-width: 375px) {
    .signup-form-container {
      padding: 1.75rem;
    }
    .signup-row {
      gap: 0.5rem;
    }
  }

  /* Large Mobile: 425px+ */
  @media screen and (min-width: 425px) {
    .signup-form-container {
      padding: 2rem;
    }
    .signup-row {
      gap: 0.75rem;
    }
  }

  /* Small Tablet: 600px+ */
  @media screen and (min-width: 600px) {
    .signup-row {
      flex-direction: row;
      gap: 0.75rem;
    }
    .signup-input-group {
      margin-bottom: 0;
    }
  }

  /* Medium Tablet: 768px+ */
  @media screen and (min-width: 768px) {
    .signup-container {
      padding: 1.25rem;
    }
    .signup-form-container {
      padding: 2.25rem;
      max-width: 35rem;
    }
    .signup-row {
      gap: 1rem;
    }
  }

  /* Large Tablet: 1024px+ */
  @media screen and (min-width: 1024px) {
    .signup-form-container {
      padding: 2.5rem;
      max-width: 37.5rem;
    }
    .signup-row {
      gap: 1.25rem;
    }
  }

  /* Small Desktop: 1440px+ */
  @media screen and (min-width: 1440px) {
    .signup-container {
      padding: 1.5rem;
    }
    .signup-form-container {
      padding: 2.75rem;
    }
  }

  /* Large Desktop: 1920px+ */
  @media screen and (min-width: 1920px) {
    .signup-container {
      padding: 2rem;
    }
    .signup-form-container {
      padding: 3rem;
    }
  }

  /* Touch devices optimization */
  @media (hover: none) and (pointer: coarse) {
    .signup-input {
      min-height: 3rem;
      font-size: 16px;
      padding: 0.75rem 1rem;
    }
    .signup-submit-button {
      min-height: 3rem;
      font-size: 1rem;
      padding: 0.875rem 1.5rem;
    }
    .signup-submit-button:hover {
      transform: none;
      box-shadow: none;
    }
    .signup-submit-button:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
    }
  }

  /* Landscape orientation for mobile */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .signup-container {
      padding: 0.5rem;
    }
    .signup-form-container {
      padding: 1rem;
      margin: 0.5rem auto;
    }
    .signup-header {
      margin-bottom: 1rem;
    }
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .signup-submit-button {
      transition: none;
    }
    .signup-submit-button:hover {
      transform: none;
    }
    .signup-spinner {
      animation: none;
    }
  }
`;

// Apply responsive styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = signupPageStyles;
  if (!document.head.querySelector('style[data-signup-responsive]')) {
    styleElement.setAttribute('data-signup-responsive', 'true');
    document.head.appendChild(styleElement);
  }
}
