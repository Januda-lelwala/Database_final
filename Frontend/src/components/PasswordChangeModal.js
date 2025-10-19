import React, { useState } from 'react';
import './PasswordChangeModal.css';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, userRole, userName }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUserName: userName || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
      if (check) strength++;
    });
    
    if (strength <= 2) return { strength, label: 'Weak', color: '#ff4444', checks };
    if (strength === 3 || strength === 4) return { strength, label: 'Medium', color: '#ffaa00', checks };
    return { strength, label: 'Strong', color: '#00cc44', checks };
  };

  const passwordStrength = checkPasswordStrength(formData.newPassword);

  const validateForm = () => {
    const newErrors = {};
    
    // Current password required
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>)';
    }
    
    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Username validation (optional but if provided, must be valid)
    if (formData.newUserName && formData.newUserName.trim()) {
      if (formData.newUserName.trim().length < 3) {
        newErrors.newUserName = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.newUserName.trim())) {
        newErrors.newUserName = 'Username can only contain letters, numbers, and underscores';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      };
      
      // Only include new username if it was changed
      if (formData.newUserName && formData.newUserName.trim() !== userName) {
        payload.new_user_name = formData.newUserName.trim();
      }
      
      await onSubmit(payload);
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newUserName: userName || ''
      });
      setErrors({});
      
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || error.message || 'Failed to change password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay">
      <div className="password-modal">
        <div className="password-modal-header">
          <h2>🔐 Change Your Password</h2>
          <p className="password-modal-subtitle">
            For security reasons, you must change your password before accessing the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="password-modal-form">
          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={errors.currentPassword ? 'error' : ''}
                placeholder="Enter your temporary password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
                tabIndex={-1}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="error-message">{errors.currentPassword}</span>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={errors.newPassword ? 'error' : ''}
                placeholder="Enter a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
                tabIndex={-1}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div 
                    className="strength-bar" 
                    style={{ 
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color 
                    }}
                  />
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            
            {/* Password Requirements Checklist */}
            {formData.newPassword && (
              <div className="password-requirements">
                <div className={passwordStrength.checks.length ? 'req-met' : 'req-unmet'}>
                  {passwordStrength.checks.length ? '✓' : '○'} At least 8 characters
                </div>
                <div className={passwordStrength.checks.uppercase ? 'req-met' : 'req-unmet'}>
                  {passwordStrength.checks.uppercase ? '✓' : '○'} One uppercase letter
                </div>
                <div className={passwordStrength.checks.lowercase ? 'req-met' : 'req-unmet'}>
                  {passwordStrength.checks.lowercase ? '✓' : '○'} One lowercase letter
                </div>
                <div className={passwordStrength.checks.number ? 'req-met' : 'req-unmet'}>
                  {passwordStrength.checks.number ? '✓' : '○'} One number
                </div>
                <div className={passwordStrength.checks.symbol ? 'req-met' : 'req-unmet'}>
                  {passwordStrength.checks.symbol ? '✓' : '○'} One symbol (!@#$%^&*)
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
                tabIndex={-1}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Optional Username Change */}
          <div className="form-group">
            <label htmlFor="newUserName">
              Change Username (Optional)
              <span className="field-hint">Current: {userName}</span>
            </label>
            <input
              type="text"
              id="newUserName"
              name="newUserName"
              value={formData.newUserName}
              onChange={handleInputChange}
              className={errors.newUserName ? 'error' : ''}
              placeholder="Leave blank to keep current username"
              autoComplete="username"
            />
            {errors.newUserName && (
              <span className="error-message">{errors.newUserName}</span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>

          <div className="security-note">
            <strong>Note:</strong> After changing your password, you will remain logged in. 
            Please remember your new credentials for future logins.
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
