const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    store_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Store name is required' }
      }
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'City is required' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'store'
  });

  // Define associations
  Store.associate = (models) => {
    Store.hasMany(models.TruckRoute, {
      foreignKey: 'store_id',
      as: 'truckRoutes'
    });

    if (models.TrainTrip) {
      Store.hasMany(models.TrainTrip, {
        foreignKey: 'store_id',
        as: 'trainTrips'
      });
    }
  };

  return Store;
};
