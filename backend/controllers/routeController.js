const db = require('../models');
const { Route, RouteStop, RouteSchedule } = db;

// Get all routes (Admin)
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        {
          model: RouteStop,
          as: 'stops',
          order: [['stopOrder', 'ASC']]
        },
        {
          model: RouteSchedule,
          as: 'schedules'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: { routes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching routes',
      error: error.message
    });
  }
};

// Get all public routes (No auth required)
const getPublicRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      where: { status: 'active' },
      include: [
        {
          model: RouteStop,
          as: 'stops',
          attributes: ['id', 'name', 'latitude', 'longitude', 'stopOrder']
        },
        {
          model: RouteSchedule,
          as: 'schedules',
          attributes: ['id', 'departureTime', 'frequency', 'operatingDays']
        }
      ],
      order: [['routeName', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: { routes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching public routes',
      error: error.message
    });
  }
};

// Get route by ID
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByPk(id, {
      include: [
        {
          model: RouteStop,
          as: 'stops',
          order: [['stopOrder', 'ASC']]
        },
        {
          model: RouteSchedule,
          as: 'schedules'
        }
      ]
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching route',
      error: error.message
    });
  }
};

// Get public route by ID
const getPublicRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findOne({
      where: { id, status: 'active' },
      include: [
        {
          model: RouteStop,
          as: 'stops',
          attributes: ['id', 'name', 'latitude', 'longitude', 'stopOrder', 'arrivalTime', 'departureTime']
        },
        {
          model: RouteSchedule,
          as: 'schedules'
        }
      ]
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found or inactive'
      });
    }

    res.status(200).json({
      success: true,
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching route',
      error: error.message
    });
  }
};

// Create new route
const createRoute = async (req, res) => {
  try {
    const {
      routeName,
      routeCode,
      startLocationName,
      startLocationLat,
      startLocationLng,
      startLocationAddress,
      endLocationName,
      endLocationLat,
      endLocationLng,
      endLocationAddress,
      distance,
      estimatedDuration,
      baseFare,
      perKmRate,
      routeType,
      status
    } = req.body;

    // Check if route code already exists
    const existingRoute = await Route.findOne({ where: { routeCode } });
    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Route with this code already exists'
      });
    }

    // Create route
    const route = await Route.create({
      routeName,
      routeCode,
      startLocationName,
      startLocationLat,
      startLocationLng,
      startLocationAddress,
      endLocationName,
      endLocationLat,
      endLocationLng,
      endLocationAddress,
      distance,
      estimatedDuration,
      baseFare,
      perKmRate: perKmRate || 0,
      routeType,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: { route }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating route',
      error: error.message
    });
  }
};

// Update route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find route
    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check if updating route code and if it already exists
    if (updateData.routeCode && updateData.routeCode !== route.routeCode) {
      const existingRoute = await Route.findOne({ where: { routeCode: updateData.routeCode } });
      if (existingRoute) {
        return res.status(400).json({
          success: false,
          message: 'Route with this code already exists'
        });
      }
    }

    // Update route
    await route.update(updateData);

    // Fetch updated route with associations
    const updatedRoute = await Route.findByPk(id, {
      include: [
        {
          model: RouteStop,
          as: 'stops'
        },
        {
          model: RouteSchedule,
          as: 'schedules'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: { route: updatedRoute }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating route',
      error: error.message
    });
  }
};

// Delete route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Delete associated stops and schedules first
    await RouteStop.destroy({ where: { routeId: id } });
    await RouteSchedule.destroy({ where: { routeId: id } });

    // Delete route
    await route.destroy();

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting route',
      error: error.message
    });
  }
};

// Search routes
const searchRoutes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const routes = await Route.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            routeName: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            routeCode: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            startLocationName: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          },
          {
            endLocationName: {
              [db.Sequelize.Op.like]: `%${query}%`
            }
          }
        ]
      },
      include: [
        {
          model: RouteStop,
          as: 'stops'
        }
      ],
      order: [['routeName', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: routes.length,
      data: { routes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching routes',
      error: error.message
    });
  }
};

// Add stop to route
const addRouteStop = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { name, latitude, longitude, address, arrivalTime, departureTime, stopOrder } = req.body;

    // Verify route exists
    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Create stop
    const stop = await RouteStop.create({
      routeId,
      name,
      latitude,
      longitude,
      address,
      arrivalTime,
      departureTime,
      stopOrder
    });

    res.status(201).json({
      success: true,
      message: 'Route stop added successfully',
      data: { stop }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while adding route stop',
      error: error.message
    });
  }
};

// Update route stop
const updateRouteStop = async (req, res) => {
  try {
    const { routeId, stopId } = req.params;
    const updateData = req.body;

    // Find stop
    const stop = await RouteStop.findOne({
      where: { id: stopId, routeId }
    });

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Route stop not found'
      });
    }

    // Update stop
    await stop.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Route stop updated successfully',
      data: { stop }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating route stop',
      error: error.message
    });
  }
};

// Delete route stop
const deleteRouteStop = async (req, res) => {
  try {
    const { routeId, stopId } = req.params;

    const stop = await RouteStop.findOne({
      where: { id: stopId, routeId }
    });

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: 'Route stop not found'
      });
    }

    await stop.destroy();

    res.status(200).json({
      success: true,
      message: 'Route stop deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting route stop',
      error: error.message
    });
  }
};

// Add schedule to route
const addRouteSchedule = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { departureTime, frequency, operatingDays } = req.body;

    // Verify route exists
    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Create schedule
    const schedule = await RouteSchedule.create({
      routeId,
      departureTime,
      frequency: frequency || 60,
      operatingDays: operatingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    });

    res.status(201).json({
      success: true,
      message: 'Route schedule added successfully',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while adding route schedule',
      error: error.message
    });
  }
};

// Update route schedule
const updateRouteSchedule = async (req, res) => {
  try {
    const { routeId, scheduleId } = req.params;
    const updateData = req.body;

    // Find schedule
    const schedule = await RouteSchedule.findOne({
      where: { id: scheduleId, routeId }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Route schedule not found'
      });
    }

    // Update schedule
    await schedule.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Route schedule updated successfully',
      data: { schedule }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating route schedule',
      error: error.message
    });
  }
};

// Delete route schedule
const deleteRouteSchedule = async (req, res) => {
  try {
    const { routeId, scheduleId } = req.params;

    const schedule = await RouteSchedule.findOne({
      where: { id: scheduleId, routeId }
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Route schedule not found'
      });
    }

    await schedule.destroy();

    res.status(200).json({
      success: true,
      message: 'Route schedule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting route schedule',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoutes,
  getPublicRoutes,
  getRouteById,
  getPublicRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  searchRoutes,
  addRouteStop,
  updateRouteStop,
  deleteRouteStop,
  addRouteSchedule,
  updateRouteSchedule,
  deleteRouteSchedule
};
