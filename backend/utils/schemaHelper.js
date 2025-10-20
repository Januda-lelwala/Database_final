const { DataTypes } = require('sequelize');
const db = require('../models');

const { sequelize } = db;

let ensureDeliveryDatePromise = null;

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
  ensureOrderDeliveryDateColumn
};

