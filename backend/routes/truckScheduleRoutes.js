const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const truckScheduleController = require('../controllers/truckScheduleController');

router.get('/', verifyAdmin, truckScheduleController.getTruckSchedules);
router.post('/', verifyAdmin, truckScheduleController.createTruckSchedule);
router.get('/availability', verifyAdmin, truckScheduleController.checkAvailability);

module.exports = router;
