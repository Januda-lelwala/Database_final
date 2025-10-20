const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

// Authenticated driver self-profile endpoints (REGISTER BEFORE parameterized routes)
router.get('/me', verifyUser, driverController.getMyProfile);
router.put('/me', verifyUser, driverController.updateMyProfile);
router.get('/me/requests', verifyUser, driverController.getMyRequests);
router.post('/me/requests/:requestId/accept', verifyUser, driverController.acceptAssignmentRequest);

// Admin driver routes - all require admin authentication
router.get('/', verifyAdmin, driverController.getAllDrivers);
router.post('/', verifyAdmin, driverController.createDriver);
router.get('/:id', verifyAdmin, driverController.getDriverById);
router.put('/:id', verifyAdmin, driverController.updateDriver);
router.delete('/:id', verifyAdmin, driverController.deleteDriver);
router.post('/:id/change-password', driverController.changeDriverPassword);

module.exports = router;
