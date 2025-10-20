const db = require('../models');
const { Customer, Order, OrderItem, Product } = db;
const { ensureOrderDeliveryDateColumn } = require('../utils/schemaHelper');

// Get all customers (Admin only)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ['password'] }, // Don't send passwords
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: { customers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers',
      error: error.message
    });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      attributes: { exclude: ['password'] } // Don't send password
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { customer }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer',
      error: error.message
    });
  }
};

// Create new customer (Admin can create without registration flow)
const createCustomer = async (req, res) => {
  try {
    const { name, phone_no, city, address, user_name, password } = req.body;

    // Check if username already exists
    const existingCustomer = await Customer.findOne({ where: { user_name } });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this username already exists'
      });
    }

    // Generate customer ID
    const customerCount = await Customer.count();
    const customer_id = `CUS${String(customerCount + 1).padStart(3, '0')}`;

    // Create customer (password will be auto-hashed by beforeSave hook)
    const customer = await Customer.create({
      customer_id,
      name,
      phone_no,
      city,
      address,
      user_name,
      password
    });

    // Return customer without password
    const { password: _, ...customerData } = customer.toJSON();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { customer: customerData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating customer',
      error: error.message
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_no, city, address } = req.body;

    // Find customer
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update customer (excluding username and password)
    await customer.update({
      name: name || customer.name,
      phone_no: phone_no !== undefined ? phone_no : customer.phone_no,
      city: city !== undefined ? city : customer.city,
      address: address !== undefined ? address : customer.address
    });

    // Return customer without password
    const { password: _, ...customerData } = customer.toJSON();

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: { customer: customerData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer',
      error: error.message
    });
  }
};

// Delete customer (Admin only)
const deleteCustomer = async (req, res) => {
  try {
    await ensureOrderDeliveryDateColumn();
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if customer has orders
    const ordersCount = await Order.count({ where: { customer_id: id } });
    if (ordersCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete customer with existing orders. Consider deactivating instead.'
      });
    }

    await customer.destroy();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting customer',
      error: error.message
    });
  }
};

// Get customer orders
const getCustomerOrders = async (req, res) => {
  try {
    await ensureOrderDeliveryDateColumn();
    const { id } = req.params;

    // Verify customer exists
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer orders with items
    const orders = await Order.findAll({
      where: { customer_id: id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'name', 'price']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { 
        customer: {
          customer_id: customer.customer_id,
          name: customer.name,
          city: customer.city
        },
        orders 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer orders',
      error: error.message
    });
  }
};

// Search customers
const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const customers = await Customer.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            name: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            user_name: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            city: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          }
        ]
      },
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: { customers }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching customers',
      error: error.message
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  searchCustomers
};
