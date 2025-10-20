const { listTruckRoutes } = require('./truckRouteConfig');
const db = require('../models');

const ensureTruckRoutes = async () => {
  const definitions = listTruckRoutes();
  if (!definitions.length) {
    console.warn('[truckRouteSeeder] No truck routes defined in configuration.');
    return;
  }

  const { TruckRoute, Store } = db;
  await Promise.all(definitions.map(async (def) => {
    try {
      if (def.store_id) {
        const existingStore = await Store.findByPk(def.store_id);
        if (!existingStore) {
          await Store.create({
            store_id: def.store_id,
            name: def.store_name || `${def.first_city} Rail Depot`,
            city: def.first_city
          });
        }
      }

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
