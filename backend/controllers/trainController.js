// Find routes by destination only
const findRoutesByDestination = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }

    // Find all routes where destinations list includes the given destination
    const routes = await db.TrainRoute.findAll();
    const matchingRoutes = routes.filter(route => {
      if (!route.destinations) return false;
      let destList;
      try {
        destList = Array.isArray(route.destinations)
          ? route.destinations
          : JSON.parse(route.destinations);
      } catch {
        destList = route.destinations.split(',').map(d => d.trim());
      }
      return destList.includes(destination);
    });

    res.status(200).json({
      success: true,
      count: matchingRoutes.length,
      data: { routes: matchingRoutes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while finding routes',
      error: error.message
    });
  }
};
const db = require('../models');
const { Train } = db;

// Generate train ID
const generateTrainId = async () => {
  const trainCount = await Train.count();
  return `TRN${String(trainCount + 1).padStart(3, '0')}`;
};

// Get all trains
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.findAll({
      order: [['train_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: trains.length,
      data: { trains }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trains',
      error: error.message
    });
  }
};

// Get train by ID
const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;

    const train = await Train.findByPk(id);

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { train }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching train',
      error: error.message
    });
  }
};

// Create new train and train_route
const createTrain = async (req, res) => {
  try {
    const { capacity, notes, begin_time, route_id, start_city, end_city, destinations } = req.body;

    console.log('[createTrain] Received data:', { capacity, notes, begin_time, route_id, start_city, end_city, destinations });

    // Generate train ID
    const train_id = await generateTrainId();

    // Handle route: Create new route or use existing route_id
    let finalRouteId = null;
    let trainRoute = null;
    
    if (start_city && end_city) {
      if (route_id) {
        // Check if route exists
        trainRoute = await db.TrainRoute.findByPk(route_id);
        if (trainRoute) {
          console.log('[createTrain] Using existing route:', route_id);
          finalRouteId = route_id;
        } else {
          // Create new route with provided route_id
          console.log('[createTrain] Creating new route:', route_id);
          trainRoute = await db.TrainRoute.create({
            route_id,
            start_city,
            end_city,
            destinations: destinations || null
          });
          finalRouteId = route_id;
        }
      } else {
        // Auto-generate route_id
        const autoRouteId = `R-${start_city.substring(0,3).toUpperCase()}-${end_city.substring(0,3).toUpperCase()}`;
        trainRoute = await db.TrainRoute.findByPk(autoRouteId);
        
        if (!trainRoute) {
          console.log('[createTrain] Creating new auto-generated route:', autoRouteId);
          trainRoute = await db.TrainRoute.create({
            route_id: autoRouteId,
            start_city,
            end_city,
            destinations: destinations || null
          });
        } else {
          console.log('[createTrain] Using existing auto-generated route:', autoRouteId);
        }
        finalRouteId = autoRouteId;
      }
    }

    // Create train with route_id
    const train = await Train.create({
      train_id,
      capacity,
      notes: notes || null,
      route_id: finalRouteId,
      begin_time: begin_time || null
    });

    console.log('[createTrain] Train created:', train_id, 'with route_id:', finalRouteId);

    res.status(201).json({
      success: true,
      message: 'Train and route created successfully',
      data: {
        train,
        train_route: trainRoute
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating train',
      error: error.message
    });
  }
};

// Update train
const updateTrain = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, notes } = req.body;

    // Find train
    const train = await Train.findByPk(id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    // Update train
    await train.update({
      capacity: capacity !== undefined ? capacity : train.capacity,
      notes: notes !== undefined ? notes : train.notes
    });

    res.status(200).json({
      success: true,
      message: 'Train updated successfully',
      data: { train }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating train',
      error: error.message
    });
  }
};

// Delete train
const deleteTrain = async (req, res) => {
  try {
    const { id } = req.params;

    const train = await Train.findByPk(id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    await train.destroy();

    res.status(200).json({
      success: true,
      message: 'Train deleted successfully'
    });
  } catch (error) {
    // Check if error is due to foreign key constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete train as it is referenced in train trips'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting train',
      error: error.message
    });
  }
};

// Get trains by capacity range
const getTrainsByCapacity = async (req, res) => {
  try {
    const { minCapacity, maxCapacity } = req.query;

    const whereClause = {};
    
    if (minCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.gte]: minCapacity };
    }
    
    if (maxCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.lte]: maxCapacity };
    }

    const trains = await Train.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      order: [['capacity', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: trains.length,
      data: { trains }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trains',
      error: error.message
    });
  }
};

// Find trips by destination
const findTripsByDestination = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required.' });
    }

    // Find all routes where destinations list includes the given destination
    const routes = await db.TrainRoute.findAll();
    // Filter routes whose destinations field includes the destination
    const matchingRoutes = routes.filter(route => {
      if (!route.destinations) return false;
      // Support comma-separated or JSON array
      let destList;
      try {
        destList = Array.isArray(route.destinations)
          ? route.destinations
          : JSON.parse(route.destinations);
      } catch {
        destList = route.destinations.split(',').map(d => d.trim());
      }
      return destList.includes(destination);
    });

    // For each matching route, find associated trains and include full route details
    let trains = [];
    for (const route of matchingRoutes) {
      const routeTrains = await db.Train.findAll({ where: { route_id: route.route_id } });
      trains = trains.concat(routeTrains.map(train => ({
        trip_id: train.train_id, // Use train_id as unique trip_id
        ...train.toJSON(),
        route: {
          route_id: route.route_id,
          start_city: route.start_city,
          end_city: route.end_city,
          destinations: route.destinations
        }
      })));
    }

    res.status(200).json({
      success: true,
      count: trains.length,
      data: { trains }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while finding trips',
      error: error.message
    });
  }
};

module.exports = {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  getTrainsByCapacity,
  findTripsByDestination,
  findRoutesByDestination
};
