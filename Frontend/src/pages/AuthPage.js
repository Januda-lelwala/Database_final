import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [userType, setUserType] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userType || !credentials.username || !credentials.password) {
      showToast('Please select user type and enter username and password', { type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      // Call real auth via context -> backend /auth/login
      const user = await login(credentials.username, credentials.password, userType);
      
      // Navigate to appropriate dashboard based on user role
      if (user?.role === 'customer') {
        navigate('/customer');
      } else if (user?.role === 'admin' || user?.role === 'driver' || user?.role === 'assistant') {
        navigate('/employee');
      } else {
        navigate('/login'); // Fallback if unknown role
      }
    } catch (err) {
      showToast(err.message || 'Login failed', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>KandyPack Access</h1>
          <p style={styles.subtitle}>Select your role and login to continue</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {/* User Type Selection */}
          <div style={styles.userTypeSection}>
            <label style={styles.label}>Select User Type:</label>
            <div style={styles.userTypeButtons}>
              <button
                type="button"
                style={{
                  ...styles.userTypeBtn,
                  ...(userType === 'admin' ? styles.selectedUserType : {})
                }}
                onClick={() => setUserType('admin')}
              >
                🔧 Admin Access
                <span style={styles.userTypeDesc}>Full system control</span>
              </button>
              <button
                type="button"
                style={{
                  ...styles.userTypeBtn,
                  ...(userType === 'customer' ? styles.selectedUserType : {})
                }}
                onClick={() => setUserType('customer')}
              >
                👤 Customer Access
                <span style={styles.userTypeDesc}>Order & track packages</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          {userType && (
            <div style={styles.credentialsSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username:</label>
                <input
                  type="text"
                  style={styles.input}
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder={`Enter ${userType} username`}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password:</label>
                <input
                  type="password"
                  style={styles.input}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.loginBtn,
                  ...(isLoading ? styles.loadingBtn : {})
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
              </button>
            </div>
          )}
        </form>

        {/* Demo Credentials */}
        <div style={styles.demoInfo}>
          <h4 style={styles.demoTitle}>Demo Credentials:</h4>
          <p style={styles.demoText}>
            <strong>Admin:</strong> admin / admin123<br />
            <strong>Customer:</strong> customer / customer123
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    margin: 0,
    fontSize: '16px',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  userTypeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  userTypeButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userTypeBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    transition: 'all 0.2s',
  },
  selectedUserType: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    color: '#1d4ed8',
  },
  userTypeDesc: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#64748b',
    marginTop: '4px',
  },
  credentialsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  loginBtn: {
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px',
  },
  loadingBtn: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },
  demoInfo: {
    marginTop: '30px',
    padding: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '8px',
    textAlign: 'center',
  },
  demoTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  demoText: {
    margin: 0,
    fontSize: '12px',
    color: '#64748b',
    lineHeight: '1.5',
  },
};

export default AuthPage;

