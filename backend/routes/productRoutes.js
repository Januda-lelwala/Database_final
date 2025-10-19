const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const productController = require('../controllers/productController');

// Public product routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/low-stock', verifyAdmin, productController.getLowStockProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Admin product routes
router.post('/', verifyAdmin, validateProduct, productController.createProduct);
router.put('/:id', verifyAdmin, validateProduct, productController.updateProduct);
router.delete('/:id', verifyAdmin, productController.deleteProduct);
router.patch('/:id/stock', verifyAdmin, productController.updateProductStock);

module.exports = router;
