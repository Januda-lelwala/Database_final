const fs = require('fs');
const path = require('path');

let cachedConfig = null;

const loadConfig = () => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const filePath = path.join(__dirname, '..', 'config', 'truck-routes.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    cachedConfig = parsed;
  } catch (error) {
    console.error('[truckRouteConfig] Failed to load truck-routes.json:', error.message);
    cachedConfig = {};
  }
  return cachedConfig;
};

const refreshConfig = () => {
  cachedConfig = null;
  return loadConfig();
};

const listTruckRoutes = () => {
  const config = loadConfig();
  return Object.entries(config).map(([routeId, definition]) => ({
    route_id: routeId,
    ...definition
  }));
};

const getTruckRouteDefinition = (routeId) => {
  const config = loadConfig();
  return config[routeId] || null;
};

const findRouteByDestination = (destination) => {
  if (!destination) return null;
  const cityLower = destination.trim().toLowerCase();
  const config = loadConfig();
  for (const [routeId, definition] of Object.entries(config)) {
    const coverage = definition.coverage || [];
    if (coverage.some(city => String(city).trim().toLowerCase() === cityLower)) {
      return { route_id: routeId, ...definition };
    }
  }
  return null;
};

module.exports = {
  loadConfig,
  refreshConfig,
  listTruckRoutes,
  getTruckRouteDefinition,
  findRouteByDestination
};
