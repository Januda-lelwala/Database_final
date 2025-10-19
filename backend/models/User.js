const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: { args: [2, 50], msg: 'Name must be between 2 and 50 characters' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6], msg: 'Password must be at least 6 characters' }
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: { args: /^[0-9]{10}$/, msg: 'Please enter a valid 10-digit phone number' }
      }
    },
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: {
      type: DataTypes.STRING,
      defaultValue: 'India'
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: { args: [['user']], msg: 'Invalid role' }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profileImage: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'users',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Booking, {
      foreignKey: 'userId',
      as: 'bookings'
    });
  };

  return User;
};
