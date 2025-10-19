const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Driver = sequelize.define('Driver', {
    driver_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: true,
      unique: true
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    must_change_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'driver',
    hooks: {
      beforeCreate: async (driver) => {
        if (driver.password) {
          const salt = await bcrypt.genSalt(12);
          driver.password = await bcrypt.hash(driver.password, salt);
        }
      },
      beforeUpdate: async (driver) => {
        if (driver.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          driver.password = await bcrypt.hash(driver.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  Driver.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  Driver.associate = (models) => {
    Driver.hasMany(models.TruckSchedule, {
      foreignKey: 'driver_id',
      as: 'schedules'
    });
  };

  return Driver;
};
