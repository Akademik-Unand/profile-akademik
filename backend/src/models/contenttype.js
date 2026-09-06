'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentType extends Model {
    static associate(models) {
      ContentType.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      ContentType.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      ContentType.hasMany(models.ContentTypeVersion, { foreignKey: 'contentTypeId', as: 'versions' });
      ContentType.hasMany(models.ContentEntry, { foreignKey: 'contentTypeId', as: 'entries' });
      ContentType.hasMany(models.Menu, { foreignKey: 'targetContentTypeId', as: 'menus' });
    }
  }
  ContentType.init({
    unitId: { type: DataTypes.INTEGER, allowNull: true },
    scopeKey: { type: DataTypes.STRING(32), allowNull: false },
    key: { type: DataTypes.STRING(80), allowNull: false },
    name: { type: DataTypes.STRING(160), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    activeVersion: { type: DataTypes.INTEGER, allowNull: true },
    listTemplate: { type: DataTypes.JSON, allowNull: true },
    detailTemplate: { type: DataTypes.JSON, allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  }, { sequelize, modelName: 'ContentType', tableName: 'content_types', underscored: true });
  return ContentType;
};
