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
const { Op } = require('sequelize');
const db = require('../models');
const { Train, TrainTrip, TrainRoute } = db;
const { findRouteByDestination } = require('../utils/truckRouteConfig');

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

    const routes = await TrainRoute.findAll({
      include: [
        {
          model: TrainTrip,
          as: 'trips',
          include: [{ model: Train, as: 'train' }]
        }
      ]
    });

    const normalizedDestination = destination.trim().toLowerCase();

    const matchingRouteIds = routes
      .filter(route => {
        const candidates = new Set();
        if (route.start_city) {
          candidates.add(route.start_city.toLowerCase());
        }
        if (route.end_city) {
          candidates.add(route.end_city.toLowerCase());
        }

        if (route.destinations) {
          try {
            const parsed = Array.isArray(route.destinations)
              ? route.destinations
              : JSON.parse(route.destinations);
            parsed.forEach(city => candidates.add(String(city).trim().toLowerCase()));
          } catch {
            route.destinations
              .split(',')
              .map(c => c.trim().toLowerCase())
              .forEach(city => candidates.add(city));
          }
        }

        return candidates.has(normalizedDestination);
      })
      .map(route => route.route_id);

    let fallbackMeta = null;

    let candidateRouteIds = matchingRouteIds;

    if (candidateRouteIds.length === 0) {
      const fallback = findRouteByDestination(destination);
      if (fallback) {
        fallbackMeta = {
          truck_route_id: fallback.route_id,
          first_city: fallback.first_city,
          store_id: fallback.store_id,
          coverage: fallback.coverage,
          max_minutes: fallback.max_minutes
        };
        const firstCityLower = fallback.first_city.trim().toLowerCase();
        candidateRouteIds = routes
          .filter(route => {
            const values = new Set();
            if (route.start_city) values.add(route.start_city.toLowerCase());
            if (route.end_city) values.add(route.end_city.toLowerCase());
            if (route.destinations) {
              try {
                const parsed = Array.isArray(route.destinations)
                  ? route.destinations
                  : JSON.parse(route.destinations);
                parsed.forEach(city => values.add(String(city).trim().toLowerCase()));
              } catch {
                route.destinations
                  .split(',')
                  .map(c => c.trim().toLowerCase())
                  .forEach(city => values.add(city));
              }
            }
            return values.has(firstCityLower);
          })
          .map(route => route.route_id);
      }
    }

    if (candidateRouteIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: { trips: [] }
      });
    }

    const trips = await TrainTrip.findAll({
      where: {
        route_id: { [Op.in]: candidateRouteIds }
      },
      include: [
        { model: Train, as: 'train' },
        { model: TrainRoute, as: 'route' }
      ],
      order: [['depart_time', 'ASC']]
    });

    const formattedTrips = trips.map(trip => {
      const train = trip.train || {};
      const remainingCapacity = Number(trip.capacity) - Number(trip.capacity_used || 0);
      return {
        trip_id: trip.trip_id,
        train_id: trip.train_id,
        route_id: trip.route_id,
        depart_time: trip.depart_time,
        arrive_time: trip.arrive_time,
        begin_time: train.begin_time || null,
        capacity: trip.capacity,
        capacity_used: trip.capacity_used,
        remaining_capacity: remainingCapacity,
        store_id: trip.store_id,
        train_notes: train.notes || null,
        is_provisional: false,
        fallback: fallbackMeta
      };
    });

    const trains = await Train.findAll({
      where: {
        route_id: { [Op.in]: candidateRouteIds }
      }
    });

    const existingTrainIds = new Set(formattedTrips.map(t => t.train_id));

    const provisionalTrips = trains
      .filter(train => !existingTrainIds.has(train.train_id))
      .map(train => ({
        trip_id: null,
        train_id: train.train_id,
        route_id: train.route_id,
        depart_time: null,
        arrive_time: null,
        begin_time: train.begin_time || null,
        capacity: train.capacity,
        capacity_used: 0,
        remaining_capacity: Number(train.capacity || 0),
        store_id: null,
        train_notes: train.notes || null,
        is_provisional: true,
        fallback: fallbackMeta
      }));

    const combined = [...formattedTrips, ...provisionalTrips];

    res.status(200).json({
      success: true,
      count: combined.length,
      data: { trips: combined }
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
