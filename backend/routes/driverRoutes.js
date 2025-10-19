const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

// Admin driver routes - all require admin authentication
router.get('/', verifyAdmin, driverController.getAllDrivers);
router.post('/', verifyAdmin, driverController.createDriver);
router.get('/:id', verifyAdmin, driverController.getDriverById);
router.put('/:id', verifyAdmin, driverController.updateDriver);
router.delete('/:id', verifyAdmin, driverController.deleteDriver);
router.post('/:id/change-password', driverController.changeDriverPassword);

module.exports = router;
