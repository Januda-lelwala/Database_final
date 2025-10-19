const express = require('express');
const router = express.Router();
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const { validateStore } = require('../middleware/validation');
const storeController = require('../controllers/storeController');

// Public store routes
router.get('/', storeController.getAllStores);
router.get('/cities', storeController.getAvailableCities);
router.get('/search', storeController.getStoresByCity);
router.get('/:id', storeController.getStoreById);
router.get('/:id/products', storeController.getStoreProducts);

// Admin store routes
router.post('/', verifyAdmin, validateStore, storeController.createStore);
router.put('/:id', verifyAdmin, validateStore, storeController.updateStore);
router.delete('/:id', verifyAdmin, storeController.deleteStore);

// Store inventory routes (admin only)
router.get('/:id/inventory', verifyAdmin, storeController.getStoreInventory);
router.patch('/:id/inventory', verifyAdmin, storeController.updateStoreInventory);

// Store orders routes (admin only)
router.get('/:id/orders', verifyAdmin, storeController.getStoreOrders);

module.exports = router;
