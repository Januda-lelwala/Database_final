const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');
const orderController = require('../controllers/orderController');

// Order routes
router.get('/', verifyAdmin, orderController.getAllOrders);
router.get('/:id', verifyUser, orderController.getOrderById);
router.post('/', verifyUser, validateOrder, orderController.createOrder);
router.put('/:id', verifyUser, validateOrder, orderController.updateOrder);
router.delete('/:id', verifyAdmin, orderController.deleteOrder);

// Order items routes
router.get('/:id/items', verifyUser, orderController.getOrderItems);

// Order status route
router.patch('/:id/status', verifyAdmin, orderController.updateOrderStatus);

// Order cancellation route (for customers)
router.patch('/:id/cancel', verifyUser, orderController.cancelOrder);

module.exports = router;
