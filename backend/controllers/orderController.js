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
const { Order, OrderItem, Customer, Product, TrainTrip, Train, TrainRoute, Store } = db;
const { sequelize } = db;
const ensureNumber = (value) => Number(value || 0);

const calculateRequiredSpace = (orderInstance) => {
  if (!orderInstance?.orderItems) return 0;
  return orderInstance.orderItems.reduce((total, item) => {
    const quantity = ensureNumber(item.quantity);
    const spacePerUnit = ensureNumber(item.product?.space_consumption);
    return total + quantity * spacePerUnit;
  }, 0);
};

const generateTrainTripId = async () => {
  const tripCount = await TrainTrip.count();
  return `TT${String(tripCount + 1).padStart(4, '0')}`;
};

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
    const whereClause = {};
    if (req.query.status) {
      whereClause.status = req.query.status;
    }

    const orders = await Order.findAll({
      where: Object.keys(whereClause).length ? whereClause : undefined,
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
              attributes: ['product_id', 'name', 'price', 'space_consumption']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const hydratedOrders = orders.map(order => {
      const orderJSON = order.toJSON();
      const required_space = calculateRequiredSpace(orderJSON);
      return {
        ...orderJSON,
        customer_name: orderJSON.customer?.name || null,
        customer_city: orderJSON.customer?.city || null,
        required_space
      };
    });

    res.status(200).json({
      success: true,
      count: hydratedOrders.length,
      data: { orders: hydratedOrders }
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
    const validStatuses = ['pending', 'confirmed', 'placed', 'scheduled', 'in_transit', 'delivered', 'cancelled'];
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

const assignOrderToTrain = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { trip_id, train_id, route_id } = req.body;

    if (!trip_id && !train_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Train selection is required to assign an order.'
      });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Product, as: 'product' }]
        }
      ],
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Only pending or confirmed orders can be placed on a train.'
      });
    }

    const requiredSpaceRaw = calculateRequiredSpace(order);
    const requiredSpace = Number.isFinite(requiredSpaceRaw)
      ? Number(requiredSpaceRaw.toFixed(4))
      : 0;

    if (requiredSpace <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Order does not have any allocatable space requirement.'
      });
    }

    let targetTrip = null;

    if (trip_id) {
      targetTrip = await TrainTrip.findByPk(trip_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });

      if (!targetTrip) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Train trip not found'
        });
      }

      const capacityUsed = ensureNumber(targetTrip.capacity_used);
      const capacityTotal = ensureNumber(targetTrip.capacity);
      const remaining = Number((capacityTotal - capacityUsed).toFixed(4));

      if (remaining + 1e-6 < requiredSpace) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Selected trip does not have enough remaining capacity for this order.',
          data: {
            trip_id,
            required_space: requiredSpace,
            remaining_capacity: remaining
          }
        });
      }

      await targetTrip.increment('capacity_used', {
        by: requiredSpace,
        transaction
      });
      await targetTrip.reload({
        transaction,
        lock: transaction.LOCK.UPDATE
      });
    } else {
      const train = await Train.findByPk(train_id, {
        lock: transaction.LOCK.UPDATE,
        transaction
      });

      if (!train) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Selected train not found.'
        });
      }

      const routeIdToUse = route_id || train.route_id;

      if (!routeIdToUse) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Selected train does not have an associated route.'
        });
      }

      const trainCapacity = ensureNumber(train.capacity);
      if (trainCapacity < requiredSpace) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Selected train does not have enough capacity for this order.'
        });
      }

      const tripIdentifier = await generateTrainTripId();

      const normalizedDestination = order.destination_city
        ? order.destination_city.trim().toLowerCase()
        : null;

      let destinationStore = null;

      if (normalizedDestination) {
        destinationStore = await Store.findOne({
          where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('city')),
            normalizedDestination
          ),
          transaction,
          lock: transaction.LOCK.SHARE
        });
      }

      if (!destinationStore) {
        const route = await TrainRoute.findByPk(routeIdToUse, {
          transaction,
          lock: transaction.LOCK.SHARE
        });

        if (route?.end_city) {
          const normalizedEnd = route.end_city.trim().toLowerCase();
          destinationStore = await Store.findOne({
            where: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('city')),
              normalizedEnd
            ),
            transaction,
            lock: transaction.LOCK.SHARE
          });
        }
      }

      if (!destinationStore) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'No destination store configured for this route. Please add a store for the destination city.'
        });
      }

      const departTime = new Date();
      const arriveTime = new Date(departTime.getTime() + 6 * 60 * 60 * 1000);

      targetTrip = await TrainTrip.create({
        trip_id: tripIdentifier,
        route_id: routeIdToUse,
        train_id,
        depart_time: departTime,
        arrive_time: arriveTime,
        capacity: train.capacity,
        capacity_used: requiredSpace,
        store_id: destinationStore.store_id
      }, { transaction });
    }

    await order.update(
      { status: 'placed', updated_at: new Date() },
      { transaction }
    );

    await transaction.commit();

    const refreshedTrip = await TrainTrip.findByPk(targetTrip.trip_id);

    return res.status(200).json({
      success: true,
      message: 'Order assigned to train successfully.',
      data: {
        order: {
          order_id: order.order_id,
          status: order.status,
          required_space: requiredSpace
        },
        trip: refreshedTrip ? {
          ...refreshedTrip.toJSON(),
          remaining_capacity: ensureNumber(refreshedTrip.capacity) - ensureNumber(refreshedTrip.capacity_used)
        } : null
      }
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('[assignOrderToTrain] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while assigning order to train',
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
  , cancelOrder,
  assignOrderToTrain
};
