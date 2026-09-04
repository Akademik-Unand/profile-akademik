'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    static associate(models) {
      PostCategory.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      PostCategory.hasMany(models.Post, { foreignKey: 'categoryId', as: 'posts' });
      PostCategory.hasMany(models.Menu, { foreignKey: 'targetCategoryId', as: 'menus' });
    }
  }

  PostCategory.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'PostCategory',
      tableName: 'post_categories',
      underscored: true,
    },
  );

  return PostCategory;
};
