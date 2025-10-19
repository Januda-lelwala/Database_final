const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin,
  getUserProfile,
  getAdminProfile,
  registerDriver,
  loginDriver,
  registerAssistant,
  loginAssistant
} = require('../controllers/authController');
const { verifyUser, verifyAdmin } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateAdminRegistration,
  validateAdminLogin,
  validateDriverRegistration,
  validateDriverLogin,
  validateAssistantRegistration,
  validateAssistantLogin
} = require('../middleware/validation');

// User routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.get('/profile', verifyUser, getUserProfile);

// Admin routes
router.post('/admin/register', validateAdminRegistration, verifyAdmin, registerAdmin);
router.post('/admin/login', validateAdminLogin, loginAdmin);
router.get('/admin/profile', verifyAdmin, getAdminProfile);

// Driver routes
router.post('/driver/register', validateDriverRegistration, registerDriver);
router.post('/driver/login', validateDriverLogin, loginDriver);

// Assistant routes
router.post('/assistant/register', validateAssistantRegistration, registerAssistant);
router.post('/assistant/login', validateAssistantLogin, loginAssistant);

module.exports = router;
