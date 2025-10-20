const { QueryTypes } = require('sequelize');
const db = require('../models');

const { sequelize } = db;

const toNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const normalizeNumericFields = (rows, fields = []) =>
  rows.map(row => {
    const normalized = { ...row };
    fields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(normalized, field)) {
        normalized[field] = toNumber(normalized[field]);
      }
    });
    return normalized;
  });

const sendQuery = async (res, query, numericFields = []) => {
  try {
    const rows = await sequelize.query(query, { type: QueryTypes.SELECT });
    const normalized = normalizeNumericFields(rows, numericFields);
    return res.json(normalized);
  } catch (error) {
    console.error('[reportController] query failed:', error);
    return res.status(500).json({ error: 'Failed to generate report.' });
  }
};

const getQuarterlySales = async (_req, res) => {
  return sendQuery(
    res,
    `SELECT quarter, total_value, total_space_units, orders
     FROM v_quarterly_sales
     ORDER BY quarter DESC`,
    ['total_value', 'total_space_units', 'orders']
  );
};

const getQuarterTopItems = async (_req, res) => {
  return sendQuery(
    res,
    `SELECT year, quarter, product_id, product_name, total_qty
     FROM v_quarter_top_items
     ORDER BY year DESC, quarter DESC, total_qty DESC
     LIMIT 100`,
    ['year', 'quarter', 'total_qty']
  );
};

const getCityRouteSales = async (_req, res) => {
  return sendQuery(
    res,
    `SELECT destination_city, route_name, total_value, orders
     FROM v_city_route_sales
     ORDER BY total_value DESC`,
    ['total_value', 'orders']
  );
};

const getWorkerHours = async (_req, res) => {
  return sendQuery(
    res,
    `SELECT role, worker_id, week, hours
     FROM v_worker_hours
     ORDER BY week DESC, role ASC, worker_id ASC`,
    ['hours']
  );
};

const getTruckUsage = async (_req, res) => {
  return sendQuery(
    res,
    `SELECT truck_id, month, runs, hours
     FROM v_truck_usage
     ORDER BY month DESC, truck_id ASC`,
    ['runs', 'hours']
  );
};

const getTrainUtilization = async (_req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT
         tt.trip_id,
         tt.train_id,
         tt.route_id,
         COALESCE(tr.route_name, '') AS route_name,
         tt.depart_time,
         tt.arrive_time,
         tt.capacity AS capacity,
         tt.capacity_used AS capacity_used,
         ROUND(IFNULL(tt.capacity_used, 0) / NULLIF(tt.capacity, 0) * 100, 2) AS utilization_percent
       FROM train_trip tt
       LEFT JOIN train_route tr ON tr.route_id = tt.route_id
       ORDER BY tt.depart_time DESC
       LIMIT 200`,
      { type: QueryTypes.SELECT }
    );

    const normalized = rows.map(row => ({
      ...row,
      capacity: toNumber(row.capacity),
      capacity_used: toNumber(row.capacity_used),
      utilization_percent: toNumber(row.utilization_percent)
    }));

    return res.json(normalized);
  } catch (error) {
    console.error('[reportController] getTrainUtilization failed:', error);
    return res.status(500).json({ error: 'Failed to generate train utilization report.' });
  }
};

module.exports = {
  getQuarterlySales,
  getQuarterTopItems,
  getCityRouteSales,
  getWorkerHours,
  getTruckUsage,
  getTrainUtilization
};
