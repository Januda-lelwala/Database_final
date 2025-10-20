const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser, checkPermission } = require('../middleware/auth');
const { validateRoute } = require('../middleware/validation');
const routeController = require('../controllers/routeController');

// Public routes
router.get('/cities', routeController.getAllCities); // Get all available delivery cities
router.get('/public', routeController.getPublicRoutes);
router.get('/public/:id', routeController.getPublicRouteById);

// Protected routes - require user authentication
router.get('/search', verifyUser, routeController.searchRoutes);

// Admin routes - require admin authentication
router.get('/', verifyAdmin, routeController.getAllRoutes);
router.get('/:id', verifyAdmin, routeController.getRouteById);
router.post('/', verifyAdmin, validateRoute, routeController.createRoute);
router.put('/:id', verifyAdmin, validateRoute, routeController.updateRoute);
router.delete('/:id', verifyAdmin, checkPermission('manage_routes'), routeController.deleteRoute);

// Route stops management
router.post('/:routeId/stops', verifyAdmin, routeController.addRouteStop);
router.put('/:routeId/stops/:stopId', verifyAdmin, routeController.updateRouteStop);
router.delete('/:routeId/stops/:stopId', verifyAdmin, routeController.deleteRouteStop);

// Route schedules management
router.post('/:routeId/schedules', verifyAdmin, routeController.addRouteSchedule);
router.put('/:routeId/schedules/:scheduleId', verifyAdmin, routeController.updateRouteSchedule);
router.delete('/:routeId/schedules/:scheduleId', verifyAdmin, routeController.deleteRouteSchedule);

module.exports = router;
