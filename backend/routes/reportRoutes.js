const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

router.get('/quarterly-sales', verifyAdmin, reportController.getQuarterlySales);
router.get('/quarter-top-items', verifyAdmin, reportController.getQuarterTopItems);
router.get('/city-route-sales', verifyAdmin, reportController.getCityRouteSales);
router.get('/worker-hours', verifyAdmin, reportController.getWorkerHours);
router.get('/truck-usage', verifyAdmin, reportController.getTruckUsage);
router.get('/train-utilization', verifyAdmin, reportController.getTrainUtilization);

module.exports = router;
