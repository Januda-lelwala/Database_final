const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    routeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Route name is required' },
        len: { args: [2, 100], msg: 'Route name must be between 2 and 100 characters' }
      }
    },
    routeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Route code is required' }
      }
    },
    startLocationName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Start location name is required' }
      }
    },
    startLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    startLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    startLocationAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    endLocationName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'End location name is required' }
      }
    },
    endLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    endLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    endLocationAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Distance cannot be negative' }
      }
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Duration must be at least 1 minute' }
      }
    },
    baseFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Fare cannot be negative' }
      }
    },
    perKmRate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'inactive', 'suspended']],
          msg: 'Invalid route status'
        }
      }
    },
    routeType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['city', 'intercity', 'highway', 'local']],
          msg: 'Invalid route type'
        }
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'routes'
  });

  // Define associations
  Route.associate = (models) => {
    Route.hasMany(models.RouteStop, {
      foreignKey: 'routeId',
      as: 'stops'
    });
    
    Route.hasMany(models.RouteSchedule, {
      foreignKey: 'routeId',
      as: 'schedules'
    });
    
    // Vehicle model removed
    // Route.belongsToMany(models.Vehicle, {
    //   through: 'vehicle_routes',
    //   foreignKey: 'route_id',
    //   otherKey: 'vehicle_id',
    //   as: 'vehicles'
    // });
    
    Route.hasMany(models.Booking, {
      foreignKey: 'routeId',
      as: 'bookings'
    });
  };

  return Route;
};
