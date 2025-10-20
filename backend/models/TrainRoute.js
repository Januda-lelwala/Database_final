const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrainRoute = sequelize.define('TrainRoute', {
    route_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    start_city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    end_city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    destinations: {
      type: DataTypes.TEXT, // Comma-separated or JSON string
      allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'train_route'
  });

  // Associations
  TrainRoute.associate = (models) => {
    TrainRoute.hasMany(models.Train, {
      foreignKey: 'route_id',
      as: 'trains'
    });

    if (models.TrainTrip) {
      TrainRoute.hasMany(models.TrainTrip, {
        foreignKey: 'route_id',
        as: 'trips'
      });
    }
  };

  return TrainRoute;
};
