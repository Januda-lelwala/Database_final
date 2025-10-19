const db = require('../models');
const { Truck } = db;

// Generate truck ID
const generateTruckId = async () => {
  const truckCount = await Truck.count();
  return `TRK${String(truckCount + 1).padStart(3, '0')}`;
};

// Get all trucks
const getAllTrucks = async (req, res) => {
  try {
    const trucks = await Truck.findAll({
      order: [['truck_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: trucks.length,
      data: { trucks }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trucks',
      error: error.message
    });
  }
};

// Get truck by ID
const getTruckById = async (req, res) => {
  try {
    const { id } = req.params;

    const truck = await Truck.findByPk(id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { truck }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching truck',
      error: error.message
    });
  }
};

// Create new truck
const createTruck = async (req, res) => {
  try {
    const { license_plate, capacity } = req.body;

    // Check if license plate already exists
    const existingTruck = await Truck.findOne({ where: { license_plate } });
    if (existingTruck) {
      return res.status(400).json({
        success: false,
        message: 'A truck with this license plate already exists'
      });
    }

    // Generate truck ID
    const truck_id = await generateTruckId();

    // Create new truck
    const truck = await Truck.create({
      truck_id,
      license_plate,
      capacity
    });

    res.status(201).json({
      success: true,
      message: 'Truck created successfully',
      data: { truck }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating truck',
      error: error.message
    });
  }
};

// Update truck
const updateTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const { license_plate, capacity } = req.body;

    // Find truck
    const truck = await Truck.findByPk(id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    // Check if new license plate already exists (if changed)
    if (license_plate && license_plate !== truck.license_plate) {
      const existingTruck = await Truck.findOne({ where: { license_plate } });
      if (existingTruck) {
        return res.status(400).json({
          success: false,
          message: 'A truck with this license plate already exists'
        });
      }
    }

    // Update truck
    await truck.update({
      license_plate: license_plate || truck.license_plate,
      capacity: capacity !== undefined ? capacity : truck.capacity
    });

    res.status(200).json({
      success: true,
      message: 'Truck updated successfully',
      data: { truck }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating truck',
      error: error.message
    });
  }
};

// Delete truck
const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;

    const truck = await Truck.findByPk(id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    await truck.destroy();

    res.status(200).json({
      success: true,
      message: 'Truck deleted successfully'
    });
  } catch (error) {
    // Check if error is due to foreign key constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete truck as it is referenced in schedules or deliveries'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting truck',
      error: error.message
    });
  }
};

// Get trucks by capacity range
const getTrucksByCapacity = async (req, res) => {
  try {
    const { minCapacity, maxCapacity } = req.query;

    const whereClause = {};
    
    if (minCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.gte]: minCapacity };
    }
    
    if (maxCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.lte]: maxCapacity };
    }

    const trucks = await Truck.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      order: [['capacity', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: trucks.length,
      data: { trucks }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trucks',
      error: error.message
    });
  }
};

// Search trucks by license plate
const searchTrucks = async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = search
      ? {
          license_plate: {
            [db.Sequelize.Op.like]: `%${search}%`
          }
        }
      : {};

    const trucks = await Truck.findAll({
      where: whereClause,
      order: [['truck_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: trucks.length,
      data: { trucks }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching trucks',
      error: error.message
    });
  }
};

module.exports = {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  getTrucksByCapacity,
  searchTrucks
};
