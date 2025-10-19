const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TruckRoute = sequelize.define('TruckRoute', {
    route_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    store_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'store',
        key: 'store_id'
      }
    },
    route_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Route name is required' }
      }
    },
    max_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 240,
      validate: {
        min: { args: [1], msg: 'Max minutes must be greater than 0' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'truck_route'
  });

  // Define associations
  TruckRoute.associate = (models) => {
    TruckRoute.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'store'
    });

    TruckRoute.hasMany(models.TruckSchedule, {
      foreignKey: 'route_id',
      as: 'schedules'
    });
  };

  return TruckRoute;
};
