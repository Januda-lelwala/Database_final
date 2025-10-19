const express = require('express');
const router = express.Router();
const { verifyAdmin, checkPermission } = require('../middleware/auth');
const { validateTrain } = require('../middleware/validation');
const trainController = require('../controllers/trainController');

// Admin train routes - all require admin authentication
router.get('/', verifyAdmin, trainController.getAllTrains);
// Find trips by destination
router.post('/find-trips', verifyAdmin, trainController.findTripsByDestination);
// Find routes by destination only
router.post('/find-routes', verifyAdmin, trainController.findRoutesByDestination);
router.get('/capacity', verifyAdmin, trainController.getTrainsByCapacity);
router.get('/:id', verifyAdmin, trainController.getTrainById);

router.post('/', verifyAdmin, validateTrain, trainController.createTrain);
router.put('/:id', verifyAdmin, validateTrain, trainController.updateTrain);
router.delete('/:id', verifyAdmin, checkPermission('manage_vehicles'), trainController.deleteTrain);

module.exports = router;
