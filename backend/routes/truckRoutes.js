const express = require('express');
const router = express.Router();
const { verifyAdmin, checkPermission } = require('../middleware/auth');
const { validateTruck } = require('../middleware/validation');
const truckController = require('../controllers/truckController');

// Admin truck routes - all require admin authentication
router.get('/', verifyAdmin, truckController.getAllTrucks);
router.get('/search', verifyAdmin, truckController.searchTrucks);
router.get('/capacity', verifyAdmin, truckController.getTrucksByCapacity);
router.get('/:id', verifyAdmin, truckController.getTruckById);

router.post('/', verifyAdmin, validateTruck, truckController.createTruck);
router.put('/:id', verifyAdmin, validateTruck, truckController.updateTruck);
router.delete('/:id', verifyAdmin, checkPermission('manage_vehicles'), truckController.deleteTruck);

module.exports = router;
