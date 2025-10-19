import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return '#e74c3c';
      case 'driver': return '#3498db';
      case 'assistant': return '#9b59b6';
      case 'customer': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <>
      <div className="profile-dropdown" ref={dropdownRef}>
        <div 
          className="profile-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="user-avatar"
            style={{ backgroundColor: getRoleColor() }}
          >
            {getUserInitials()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'Role'}</span>
          </div>
          <i className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</i>
        </div>

        {isOpen && (
          <div className="profile-dropdown-menu">
            <div className="dropdown-header">
              <div className="user-details">
                <div 
                  className="user-avatar-large"
                  style={{ backgroundColor: getRoleColor() }}
                >
                  {getUserInitials()}
                </div>
                <div>
                  <div className="user-name-large">{user?.name}</div>
                  <div className="user-role-badge">{user?.role}</div>
                  <div className="user-portal">{user?.portalType} Portal</div>
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-items">
              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowProfileModal(true);
                  setIsOpen(false);
                }}
              >
                <i className="item-icon">👤</i>
                <span>My Profile</span>
              </button>

              <button 
                className="dropdown-item"
                onClick={() => {
                  setShowSettingsModal(true);
                  setIsOpen(false);
                }}
              >
                <i className="item-icon">⚙️</i>
                <span>Settings</span>
              </button>

              <button className="dropdown-item">
                <i className="item-icon">🔔</i>
                <span>Notifications</span>
                <span className="notification-badge">3</span>
              </button>

              <button className="dropdown-item">
                <i className="item-icon">❓</i>
                <span>Help & Support</span>
              </button>

              <div className="dropdown-divider"></div>

              <button 
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <i className="item-icon">🚪</i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          user={user}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </>
  );
};

// Profile Modal Component
const ProfileModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone_no || '',
    city: user?.city || '',
    address: user?.address || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log('Profile update:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ user, onClose }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'en'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement settings update API call
    console.log('Settings update:', settings);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="setting-item">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Push Notifications
              </label>
            </div>
            <div className="setting-item">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) => setSettings({...settings, emailUpdates: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Email Updates
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Appearance</h3>
            <div className="setting-item">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Dark Mode
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Language</h3>
            <div className="setting-item">
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
              >
                <option value="en">English</option>
                <option value="si">Sinhala</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDropdown;