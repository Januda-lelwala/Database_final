const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Truck = sequelize.define('Truck', {
    truck_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    license_plate: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'License plate is required' }
      }
    },
    capacity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      validate: {
        min: { args: [0.0001], msg: 'Capacity must be greater than 0' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'truck'
  });

  // Define associations
  Truck.associate = (models) => {
    // Truck has many schedules
    Truck.hasMany(models.TruckSchedule, {
      foreignKey: 'truck_id',
      as: 'schedules'
    });
  };

  return Truck;
};
