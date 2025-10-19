const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const { validateCustomer } = require('../middleware/validation');
const customerController = require('../controllers/customerController');

// Customer routes
router.get('/', verifyAdmin, customerController.getAllCustomers);
router.get('/search', verifyAdmin, customerController.searchCustomers);
router.get('/:id', verifyUser, customerController.getCustomerById);
router.post('/', verifyAdmin, validateCustomer, customerController.createCustomer);
router.put('/:id', verifyUser, customerController.updateCustomer);
router.delete('/:id', verifyAdmin, customerController.deleteCustomer);

// Customer order routes
router.get('/:id/orders', verifyUser, customerController.getCustomerOrders);

module.exports = router;
