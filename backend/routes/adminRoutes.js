const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin management routes - all require admin authentication
router.get('/', verifyAdmin, adminController.getAllAdmins);
router.get('/:id', verifyAdmin, adminController.getAdminById);
router.put('/:id', verifyAdmin, adminController.updateAdmin);
router.delete('/:id', verifyAdmin, adminController.deleteAdmin);

module.exports = router;
