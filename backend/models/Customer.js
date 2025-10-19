const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    phone_no: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Username is required' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: { args: [6], msg: 'Password must be at least 6 characters' }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'customer',
    hooks: {
      beforeSave: async (customer) => {
        if (customer.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          customer.password = await bcrypt.hash(customer.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  Customer.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  Customer.associate = (models) => {
    Customer.hasMany(models.Order, {
      foreignKey: 'customer_id',
      as: 'orders'
    });
  };

  return Customer;
};
