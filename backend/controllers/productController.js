const db = require('../models');
const { Product, OrderItem } = db;

// Generate product ID
const generateProductId = async () => {
  const productCount = await Product.count();
  return `PROD${String(productCount + 1).padStart(3, '0')}`;
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['product_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, space_consumption, category, available_quantity } = req.body;

    // Generate product ID
    const product_id = await generateProductId();

    // Create product
    const product = await Product.create({
      product_id,
      name,
      description: description || null,
      price,
      space_consumption,
      category: category || null,
      available_quantity: available_quantity || 0
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, space_consumption, category, available_quantity } = req.body;

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      space_consumption: space_consumption !== undefined ? space_consumption : product.space_consumption,
      category: category !== undefined ? category : product.category,
      available_quantity: available_quantity !== undefined ? available_quantity : product.available_quantity
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is referenced in order items
    const orderItemsCount = await OrderItem.count({ where: { product_id: id } });
    if (orderItemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product as it is referenced in existing orders'
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.findAll({
      where: { category: categoryId },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category',
      error: error.message
    });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            name: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            description: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            category: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          }
        ]
      },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching products',
      error: error.message
    });
  }
};

// Update product stock
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be provided and cannot be negative'
      });
    }

    // Find product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update stock
    await product.update({
      available_quantity: quantity
    });

    res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating product stock',
      error: error.message
    });
  }
};

// Get products with low stock
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await Product.findAll({
      where: {
        available_quantity: {
          [db.Sequelize.Op.lte]: threshold
        }
      },
      order: [['available_quantity', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching low stock products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  updateProductStock,
  getLowStockProducts
};
