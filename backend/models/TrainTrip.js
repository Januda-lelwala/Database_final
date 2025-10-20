const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrainTrip = sequelize.define('TrainTrip', {
    trip_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    route_id: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    train_id: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    depart_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrive_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    capacity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      validate: {
        min: { args: [0.0001], msg: 'Capacity must be greater than 0' }
      }
    },
    capacity_used: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Capacity used cannot be negative' }
      }
    },
    store_id: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'train_trip'
  });

  TrainTrip.associate = (models) => {
    TrainTrip.belongsTo(models.Train, {
      foreignKey: 'train_id',
      as: 'train'
    });

    TrainTrip.belongsTo(models.TrainRoute, {
      foreignKey: 'route_id',
      as: 'route'
    });

    if (models.Store) {
      TrainTrip.belongsTo(models.Store, {
        foreignKey: 'store_id',
        as: 'store'
      });
    }
  };

  return TrainTrip;
};

