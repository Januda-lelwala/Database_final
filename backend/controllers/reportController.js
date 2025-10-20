const { QueryTypes } = require('sequelize');
const db = require('../models');

const { sequelize } = db;

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const respond = async (res, loader, numericFields = [], fallback = []) => {
  try {
    const rows = await loader();
    const normalized = rows.map(row => {
      const copy = { ...row };
      numericFields.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(copy, field)) {
          copy[field] = toNumber(copy[field]);
        }
      });
      return copy;
    });
    return res.json(normalized);
  } catch (error) {
    console.error('[reportController] query failed:', error);
    return res.json(fallback);
  }
};

const getQuarterlySales = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
      `SELECT
         CONCAT(YEAR(o.order_date), '-Q', QUARTER(o.order_date)) AS quarter,
         SUM(oi.quantity * oi.unit_price) AS total_value,
         SUM(oi.quantity * COALESCE(p.space_consumption, 0)) AS total_space_units,
         COUNT(DISTINCT o.order_id) AS orders
       FROM orders o
       JOIN order_item oi ON oi.order_id = o.order_id
       LEFT JOIN product p ON p.product_id = oi.product_id
       GROUP BY YEAR(o.order_date), QUARTER(o.order_date)
       ORDER BY YEAR(o.order_date) DESC, QUARTER(o.order_date) DESC`,
      { type: QueryTypes.SELECT }
    ),
    ['total_value', 'total_space_units', 'orders']
  );
};

const getQuarterTopItems = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
      `SELECT
         YEAR(o.order_date) AS year,
         QUARTER(o.order_date) AS quarter,
         oi.product_id,
         p.name AS product_name,
         SUM(oi.quantity) AS total_qty
       FROM orders o
       JOIN order_item oi ON oi.order_id = o.order_id
       LEFT JOIN product p ON p.product_id = oi.product_id
       GROUP BY YEAR(o.order_date), QUARTER(o.order_date), oi.product_id, p.name
       ORDER BY year DESC, quarter DESC, total_qty DESC
       LIMIT 100`,
      { type: QueryTypes.SELECT }
    ),
    ['year', 'quarter', 'total_qty']
  );
};

const getCityRouteSales = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
      `SELECT
         o.destination_city,
         COALESCE(tr.route_name, '') AS route_name,
         SUM(oi.quantity * oi.unit_price) AS total_value,
         COUNT(DISTINCT o.order_id) AS orders
       FROM orders o
       JOIN order_item oi ON oi.order_id = o.order_id
       LEFT JOIN truck_task tt ON tt.order_id = o.order_id
       LEFT JOIN truck_route tr ON tr.route_id = tt.truck_route_id
       GROUP BY o.destination_city, tr.route_name
       ORDER BY total_value DESC`,
      { type: QueryTypes.SELECT }
    ),
    ['total_value', 'orders']
  );
};

const getWorkerHours = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
      `SELECT role, worker_id, week, hours FROM (
         SELECT
           'driver' AS role,
           s.driver_id AS worker_id,
           DATE_FORMAT(s.start_time, '%x-%v') AS week,
           SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
         FROM truck_schedule s
         GROUP BY role, worker_id, week
         UNION ALL
         SELECT
           'assistant' AS role,
           s.assistant_id AS worker_id,
           DATE_FORMAT(s.start_time, '%x-%v') AS week,
           SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
         FROM truck_schedule s
         GROUP BY role, worker_id, week
       ) hr
       ORDER BY week DESC, role ASC, worker_id ASC`,
      { type: QueryTypes.SELECT }
    ),
    ['hours']
  );
};

const getTruckUsage = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
      `SELECT
         s.truck_id,
         DATE_FORMAT(s.start_time, '%Y-%m') AS month,
         COUNT(*) AS runs,
         SUM(TIMESTAMPDIFF(MINUTE, s.start_time, s.end_time))/60 AS hours
       FROM truck_schedule s
       GROUP BY s.truck_id, month
       ORDER BY month DESC, s.truck_id ASC`,
      { type: QueryTypes.SELECT }
    ),
    ['runs', 'hours']
  );
};

const getTrainUtilization = async (_req, res) => {
  return respond(
    res,
    () => sequelize.query(
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
    ),
    ['capacity', 'capacity_used', 'utilization_percent']
  );
};

module.exports = {
  getQuarterlySales,
  getQuarterTopItems,
  getCityRouteSales,
  getWorkerHours,
  getTruckUsage,
  getTrainUtilization
};
