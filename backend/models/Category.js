const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Category name is required' }
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Category slug is required' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'categories',
    indexes: [
      {
        fields: ['slug'],
        unique: true
      },
      {
        fields: ['parent_id']
      }
    ]
  });

  // Define associations
  Category.associate = (models) => {
    // Removed Product association - Product uses string category field, not foreign key
    // Category.hasMany(models.Product, {
    //   foreignKey: 'categoryId',
    //   as: 'products'
    // });
    
    Category.belongsTo(models.Category, {
      foreignKey: 'parentId',
      as: 'parent'
    });
    
    Category.hasMany(models.Category, {
      foreignKey: 'parentId',
      as: 'subcategories'
    });
  };

  return Category;
};
