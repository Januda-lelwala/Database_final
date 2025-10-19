/**
 * Form validation utilities
 */

export const validators = {
  /**
   * Check if value is empty
   */
  isEmpty: (value) => {
    return !value || value.trim() === '';
  },

  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate minimum length
   */
  minLength: (value, min) => {
    return value && value.length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  /**
   * Validate username (alphanumeric, underscore, dash)
   */
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * Validate phone number
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  /**
   * Validate password strength
   * At least 6 characters
   */
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  /**
   * Check if passwords match
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  }
};

/**
 * Validate form data
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    fieldRules.forEach((rule) => {
      if (!errors[field]) {
        const error = rule(value);
        if (error) {
          errors[field] = error;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
