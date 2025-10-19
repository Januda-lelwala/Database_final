// Utility functions for employee credential generation

/**
 * Generate a secure random password
 * @param {number} length - Minimum 8 characters
 * @returns {string} Password with uppercase, lowercase, number, and symbol
 */
function generateSecurePassword(length = 10) {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*?';
  
  // Ensure at least one of each type
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill remaining with random from all sets
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle to randomize positions
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Extract first name from full name
 * @param {string} fullName 
 * @returns {string} First name, cleaned
 */
function extractFirstName(fullName) {
  if (!fullName) return '';
  return fullName.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
}

/**
 * Generate unique username from name with fallback
 * @param {string} name - Full name
 * @param {Function} checkExists - async function to check if username exists
 * @returns {Promise<string>} Unique username
 */
async function generateUniqueUsername(name, checkExists) {
  let baseUsername = extractFirstName(name);
  if (!baseUsername || baseUsername.length < 2) {
    baseUsername = 'user';
  }
  
  // Try base username first
  let username = baseUsername;
  let suffix = 1;
  
  while (await checkExists(username)) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }
  
  return username;
}

module.exports = {
  generateSecurePassword,
  extractFirstName,
  generateUniqueUsername
};
