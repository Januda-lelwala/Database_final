const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Product name is required' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Price must be greater than or equal to 0' }
      }
    },
    space_consumption: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      validate: {
        min: { args: [0.0001], msg: 'Space consumption must be greater than 0' }
      }
    },
    category: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Available quantity must be greater than or equal to 0' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'product'
  });

  // Define associations
  Product.associate = (models) => {
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems'
    });
    
    // Prevent Category association from adding categoryId foreign key
    // Product uses string category field, not foreign key
  };

  return Product;
};
