const { DataTypes } = require('sequelize');
const db = require('../models');

const { sequelize } = db;

let ensureDeliveryDatePromise = null;
let ensureScheduleOrderPromise = null;

const ensureOrderDeliveryDateColumn = async () => {
  if (!sequelize || typeof sequelize.getQueryInterface !== 'function') {
    return;
  }

  if (!ensureDeliveryDatePromise) {
    ensureDeliveryDatePromise = (async () => {
      try {
        const qi = sequelize.getQueryInterface();
        const tableDefinition = await qi.describeTable('orders');
        if (!tableDefinition || tableDefinition.delivery_date) {
          return;
        }
        await qi.addColumn('orders', 'delivery_date', {
          type: DataTypes.DATE,
          allowNull: true
        });
      } catch (error) {
        console.warn('[schemaHelper] ensureOrderDeliveryDateColumn:', error.message);
      }
    })();
  }

  return ensureDeliveryDatePromise;
};

module.exports = {
  ensureOrderDeliveryDateColumn,
  ensureTruckScheduleOrderColumn: async () => {
    if (!sequelize || typeof sequelize.getQueryInterface !== 'function') {
      return;
    }

    if (!ensureScheduleOrderPromise) {
      ensureScheduleOrderPromise = (async () => {
        try {
          const qi = sequelize.getQueryInterface();
          const tableDefinition = await qi.describeTable('truck_schedule');
          if (!tableDefinition || tableDefinition.order_id) {
            return;
          }
          await qi.addColumn('truck_schedule', 'order_id', {
            type: DataTypes.STRING(40),
            allowNull: true
          });
        } catch (error) {
          console.warn('[schemaHelper] ensureTruckScheduleOrderColumn:', error.message);
        }
      })();
    }

    return ensureScheduleOrderPromise;
  }
};
