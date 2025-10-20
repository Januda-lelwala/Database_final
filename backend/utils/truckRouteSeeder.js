const { listTruckRoutes } = require('./truckRouteConfig');
const db = require('../models');

const ensureTruckRoutes = async () => {
  const definitions = listTruckRoutes();
  if (!definitions.length) {
    console.warn('[truckRouteSeeder] No truck routes defined in configuration.');
    return;
  }

  const { TruckRoute } = db;
  await Promise.all(definitions.map(async (def) => {
    try {
      await TruckRoute.upsert({
        route_id: def.route_id,
        store_id: def.store_id,
        route_name: `${def.first_city} -> ${def.coverage.join(', ')}`,
        max_minutes: def.max_minutes || 240
      });
    } catch (error) {
      console.error(`[truckRouteSeeder] Failed to upsert route ${def.route_id}:`, error.message);
    }
  }));
};

module.exports = {
  ensureTruckRoutes
};
