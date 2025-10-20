const db = require('../models');
const { Store, Order, Product } = db;
const { ensureOrderDeliveryDateColumn } = require('../utils/schemaHelper');

// Generate store ID
const generateStoreId = async () => {
  const storeCount = await Store.count();
  return `ST${String(storeCount + 1).padStart(3, '0')}`;
};

// Get all stores (Public)
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      order: [['city', 'ASC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: { stores }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stores',
      error: error.message
    });
  }
};

// Get store by ID (Public)
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { store }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store',
      error: error.message
    });
  }
};

// Get stores by city (Public)
const getStoresByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }

    const stores = await Store.findAll({
      where: {
        city: {
          [db.Sequelize.Op.like]: `%${city}%`
        }
      },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: { stores }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stores by city',
      error: error.message
    });
  }
};

// Create new store (Admin only)
const createStore = async (req, res) => {
  try {
    const { name, city } = req.body;

    // Generate store ID
    const store_id = await generateStoreId();

    // Create store
    const store = await Store.create({
      store_id,
      name,
      city
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating store',
      error: error.message
    });
  }
};

// Update store (Admin only)
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city } = req.body;

    // Find store
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store
    await store.update({
      name: name || store.name,
      city: city || store.city
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: { store }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating store',
      error: error.message
    });
  }
};

// Delete store (Admin only)
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await store.destroy();

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    // Check if error is due to foreign key constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete store as it is referenced in train trips or truck routes'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting store',
      error: error.message
    });
  }
};

// Get products in a store (Public)
// Note: This assumes products are available in all stores
// If you have a store_inventory table, this would query that
const getStoreProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get all products (since there's no store_inventory table)
    // In a real scenario, you'd query store-specific inventory
    const products = await Product.findAll({
      where: {
        available_quantity: {
          [db.Sequelize.Op.gt]: 0
        }
      },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { 
        store: {
          store_id: store.store_id,
          name: store.name,
          city: store.city
        },
        products 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store products',
      error: error.message
    });
  }
};

// Get store inventory (Admin only)
// Note: This is a simplified version since there's no store_inventory table
const getStoreInventory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get all products with their inventory
    const products = await Product.findAll({
      attributes: ['product_id', 'name', 'available_quantity', 'price'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { 
        store: {
          store_id: store.store_id,
          name: store.name,
          city: store.city
        },
        inventory: products
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store inventory',
      error: error.message
    });
  }
};

// Update store inventory (Admin only)
// Note: This updates the product's available_quantity
const updateStoreInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, quantity } = req.body;

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Verify product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product quantity
    await product.update({
      available_quantity: quantity
    });

    res.status(200).json({
      success: true,
      message: 'Store inventory updated successfully',
      data: { 
        store_id: store.store_id,
        product_id: product.product_id,
        new_quantity: product.available_quantity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating store inventory',
      error: error.message
    });
  }
};

// Get orders assigned to store (Admin only)
const getStoreOrders = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get orders for this store's city
    // In a more complex system, you'd have a direct store-order relationship
    const orders = await Order.findAll({
      where: {
        destination_city: store.city
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { 
        store: {
          store_id: store.store_id,
          name: store.name,
          city: store.city
        },
        orders 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching store orders',
      error: error.message
    });
  }
};

// Get stores by availability (cities with stores)
const getAvailableCities = async (req, res) => {
  try {
    const cities = await Store.findAll({
      attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('city')), 'city']],
      order: [['city', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: cities.length,
      data: { cities: cities.map(c => c.city) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available cities',
      error: error.message
    });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  getStoresByCity,
  createStore,
  updateStore,
  deleteStore,
  getStoreProducts,
  getStoreInventory,
  updateStoreInventory,
  getStoreOrders,
  getAvailableCities
};
