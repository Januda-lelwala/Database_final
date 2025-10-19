const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RouteStop = sequelize.define('RouteStop', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Stop name is required' }
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    arrivalTime: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: 'Arrival time must be in HH:MM format'
        }
      }
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: 'Departure time must be in HH:MM format'
        }
      }
    },
    stopOrder: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'route_stops'
  });

  // Define associations
  RouteStop.associate = (models) => {
    RouteStop.belongsTo(models.Route, {
      foreignKey: 'routeId',
      as: 'route'
    });
  };

  return RouteStop;
};
