const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TruckSchedule = sequelize.define('TruckSchedule', {
    truck_schedule_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    route_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'truck_route',
        key: 'route_id'
      }
    },
    truck_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'truck',
        key: 'truck_id'
      }
    },
    driver_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'driver',
        key: 'driver_id'
      }
    },
    assistant_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'assistant',
        key: 'assistant_id'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartTime(value) {
          if (value <= this.start_time) {
            throw new Error('End time must be after start time');
          }
        }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'truck_schedule'
  });

  // Define associations
  TruckSchedule.associate = (models) => {
    TruckSchedule.belongsTo(models.TruckRoute, {
      foreignKey: 'route_id',
      as: 'route'
    });

    TruckSchedule.belongsTo(models.Truck, {
      foreignKey: 'truck_id',
      as: 'truck'
    });

    TruckSchedule.belongsTo(models.Driver, {
      foreignKey: 'driver_id',
      as: 'driver'
    });

    TruckSchedule.belongsTo(models.Assistant, {
      foreignKey: 'assistant_id',
      as: 'assistant'
    });
  };

  return TruckSchedule;
};
