// Cancel order (customer)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancelling if status is 'pending' or 'processing'
    if (!['pending', 'Processing', 'processing', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage.'
      });
    }

    // Update status and save reason
    order.status = 'cancelled';
    order.cancel_reason = reason;
    order.updated_at = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
};
const db = require('../models');
const { Order, OrderItem, Customer, Product } = db;

// Generate order ID
const generateOrderId = async () => {
  const orderCount = await Order.count();
  return `ORD${String(orderCount + 1).padStart(3, '0')}`;
};

// Generate order item ID
const generateOrderItemId = async () => {
  const itemCount = await OrderItem.count();
  return `OI${String(itemCount + 1).padStart(4, '0')}`;
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'phone_no', 'city']
        },
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
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'phone_no', 'city', 'address']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    let { customer_id, order_date, destination_city, destination_address, items } = req.body;

    // Derive customer_id from JWT for customer role if not submitted explicitly
    if (!customer_id && req.auth?.role === 'customer') {
      customer_id = req.auth.id;
    }

    // Verify customer exists
  const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Generate order ID
    const order_id = await generateOrderId();

    // Create order
    const order = await Order.create({
      order_id,
      customer_id,
      order_date: order_date || new Date(),
      destination_city,
      destination_address,
      status: 'pending'
    });

    // Create order items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        // Verify product exists
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          // Rollback order creation if product not found
          await order.destroy();
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.product_id} not found`
          });
        }

        // Generate order item ID
        const order_item_id = await generateOrderItemId();

        // Create order item
        await OrderItem.create({
          order_item_id,
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price || product.price
        });
      }
    }

    // Fetch the complete order with items
    const completeOrder = await Order.findByPk(order_id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['customer_id', 'name', 'phone_no']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: completeOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { destination_city, destination_address, status } = req.body;

    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order
    await order.update({
      destination_city: destination_city || order.destination_city,
      destination_address: destination_address || order.destination_address,
      status: status || order.status,
      updated_at: new Date()
    });

    // Fetch updated order with associations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating order',
      error: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete associated order items first (cascade delete)
    await OrderItem.destroy({ where: { order_id: id } });

    // Delete order
    await order.destroy();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order',
      error: error.message
    });
  }
};

// Get order items
const getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;

    const orderItems = await OrderItem.findAll({
      where: { order_id: id },
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (orderItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No items found for this order'
      });
    }

    res.status(200).json({
      success: true,
      count: orderItems.length,
      data: { orderItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order items',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'scheduled', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find order
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    await order.update({
      status,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItems,
  updateOrderStatus
  , cancelOrder
};
