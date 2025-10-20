const db = require('../models');
const { ensureTruckRoutes } = require('../utils/truckRouteSeeder');

const { TruckRoute, Store } = db;

/**
 * Fetch all truck routes with their destination store metadata.
 */
const getAllTruckRoutes = async (_req, res) => {
  try {
    await ensureTruckRoutes();
    const routes = await TruckRoute.findAll({
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ],
      order: [['route_id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: { routes }
    });
  } catch (error) {
    console.error('[truckRouteController.getAllTruckRoutes] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching truck routes',
      error: error.message
    });
  }
};

/**
 * Fetch a single truck route by id.
 */
const getTruckRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await TruckRoute.findByPk(id, {
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_id', 'name', 'city']
        }
      ]
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Truck route not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { route }
    });
  } catch (error) {
    console.error('[truckRouteController.getTruckRouteById] failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching truck route',
      error: error.message
    });
  }
};

module.exports = {
  getAllTruckRoutes,
  getTruckRouteById
};
