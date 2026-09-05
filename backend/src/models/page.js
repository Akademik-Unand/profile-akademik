'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      Page.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      Page.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      Page.hasMany(models.Menu, { foreignKey: 'targetPageId', as: 'menus' });
    }
  }

  Page.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      slug: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      builder: { type: DataTypes.JSON, allowNull: true },
      layout: { type: DataTypes.JSON, allowNull: true },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
      createdBy: { type: DataTypes.INTEGER, allowNull: true },
      publishedAt: { type: DataTypes.DATE, allowNull: true },
      metaTitle: { type: DataTypes.STRING, allowNull: true },
      metaDescription: { type: DataTypes.TEXT, allowNull: true },
      metaKeywords: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Page',
      tableName: 'pages',
      underscored: true,
    },
  );

  return Page;
};
