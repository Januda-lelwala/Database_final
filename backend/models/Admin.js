const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    admin_id: {
      type: DataTypes.STRING(20),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' }
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
    tableName: 'admin',
    hooks: {
      beforeSave: async (admin) => {
        if (admin.changed('password')) {
          const salt = await bcrypt.genSalt(12);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // No associations for Admin in KandyPack schema
  Admin.associate = (models) => {
    // Admin has no foreign key relationships
  };

  return Admin;
};
