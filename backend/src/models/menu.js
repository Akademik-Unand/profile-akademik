'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      Menu.belongsTo(models.Menu, { foreignKey: 'parentId', as: 'parent' });
      Menu.hasMany(models.Menu, { foreignKey: 'parentId', as: 'children' });
      Menu.belongsTo(models.Page, { foreignKey: 'targetPageId', as: 'targetPage' });
      Menu.belongsTo(models.PostCategory, { foreignKey: 'targetCategoryId', as: 'targetCategory' });
    }
  }

  Menu.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      parentId: { type: DataTypes.INTEGER, allowNull: true },
      label: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM('page', 'post_category', 'external_url', 'archive'),
        allowNull: false,
      },
      targetPageId: { type: DataTypes.INTEGER, allowNull: true },
      targetCategoryId: { type: DataTypes.INTEGER, allowNull: true },
      externalUrl: { type: DataTypes.STRING, allowNull: true },
      location: {
        type: DataTypes.ENUM('header', 'footer'),
        allowNull: false,
        defaultValue: 'header',
      },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'Menu',
      tableName: 'menus',
      underscored: true,
    },
  );

  return Menu;
};
