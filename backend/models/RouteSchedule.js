const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RouteSchedule = sequelize.define('RouteSchedule', {
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
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: 'Departure time must be in HH:MM format'
        }
      }
    },
    frequency: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 60
    },
    operatingDays: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      validate: {
        isValidDays(value) {
          const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          if (!Array.isArray(value) || !value.every(day => validDays.includes(day))) {
            throw new Error('Invalid operating days');
          }
        }
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'route_schedules'
  });

  // Define associations
  RouteSchedule.associate = (models) => {
    RouteSchedule.belongsTo(models.Route, {
      foreignKey: 'routeId',
      as: 'route'
    });
  };

  return RouteSchedule;
};
