const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'orders',
        key: 'order_id'
      }
    },
    product_id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: 'product',
        key: 'product_id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Quantity must be at least 1' }
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Unit price must be greater than or equal to 0' }
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'order_item'
  });

  // Define associations
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
    
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return OrderItem;
};
