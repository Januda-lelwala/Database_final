const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Train = sequelize.define('Train', {
    train_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    capacity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      validate: {
        min: { args: [0.0001], msg: 'Capacity must be greater than 0' }
      }
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    route_id: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    begin_time: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'train'
  });

  // Define associations
  Train.associate = (models) => {
    Train.belongsTo(models.TrainRoute, {
      foreignKey: 'route_id',
      as: 'route'
    });

    if (models.TrainTrip) {
      Train.hasMany(models.TrainTrip, {
        foreignKey: 'train_id',
        as: 'trips'
      });
    }
  };

  return Train;
};
