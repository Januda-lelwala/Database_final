const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const truckRouteController = require('../controllers/truckRouteController');

router.get('/', verifyAdmin, truckRouteController.getAllTruckRoutes);
router.get('/:id', verifyAdmin, truckRouteController.getTruckRouteById);

module.exports = router;
