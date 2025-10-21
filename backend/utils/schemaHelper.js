const { DataTypes } = require('sequelize');
const db = require('../models');

const { sequelize } = db;

let ensureDeliveryDatePromise = null;
let ensureScheduleOrderPromise = null;
let ensureStatusGuardPromise = null;

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

const ensureOrderStatusFunction = async () => {
  if (!sequelize || typeof sequelize.query !== 'function') {
    return;
  }

  if (!ensureStatusGuardPromise) {
    ensureStatusGuardPromise = (async () => {
      try {
        const dbName = typeof sequelize.getDatabaseName === 'function'
          ? sequelize.getDatabaseName()
          : sequelize.config?.database;

        const [existing] = await sequelize.query(
          'SHOW FUNCTION STATUS WHERE Db = :db AND Name = :name',
          {
            replacements: {
              db: dbName,
              name: 'fn_status_transition_ok'
            }
          }
        );

        if (Array.isArray(existing) && existing.length > 0) {
          return;
        }

        await sequelize.query(`
          CREATE FUNCTION fn_status_transition_ok(old_status VARCHAR(32), new_status VARCHAR(32))
          RETURNS TINYINT(1)
          DETERMINISTIC
          BEGIN
            DECLARE old_norm VARCHAR(32);
            DECLARE new_norm VARCHAR(32);

            SET old_norm = LOWER(COALESCE(old_status, ''));
            SET new_norm = LOWER(COALESCE(new_status, ''));

            IF new_norm = '' THEN
              RETURN 0;
            END IF;

            IF old_norm = '' THEN
              RETURN 1;
            END IF;

            IF old_norm = new_norm THEN
              RETURN 1;
            END IF;

            IF old_norm = 'pending' AND new_norm IN ('pending', 'processing', 'confirmed', 'placed', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'processing' AND new_norm IN ('processing', 'confirmed', 'placed', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'confirmed' AND new_norm IN ('confirmed', 'placed', 'scheduled', 'in_transit', 'delivered', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'placed' AND new_norm IN ('placed', 'scheduled', 'in_transit', 'delivered', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'scheduled' AND new_norm IN ('scheduled', 'in_transit', 'delivered', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'in_transit' AND new_norm IN ('in_transit', 'delivered', 'cancelled') THEN
              RETURN 1;
            END IF;

            IF old_norm = 'delivered' AND new_norm = 'delivered' THEN
              RETURN 1;
            END IF;

            IF old_norm = 'cancelled' AND new_norm = 'cancelled' THEN
              RETURN 1;
            END IF;

            RETURN 0;
          END
        `);
      } catch (error) {
        console.warn('[schemaHelper] ensureOrderStatusFunction:', error.message);
      }
    })();
  }

  return ensureStatusGuardPromise;
};

const ensureTruckScheduleOrderColumn = async () => {
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
};

module.exports = {
  ensureOrderDeliveryDateColumn,
  ensureOrderStatusFunction,
  ensureTruckScheduleOrderColumn
};
