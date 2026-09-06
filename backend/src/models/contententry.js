'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentEntry extends Model {
    static associate(models) {
      ContentEntry.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      ContentEntry.belongsTo(models.ContentType, { foreignKey: 'contentTypeId', as: 'contentType' });
      ContentEntry.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }
  ContentEntry.init({
    unitId: { type: DataTypes.INTEGER, allowNull: true },
    scopeKey: { type: DataTypes.STRING(32), allowNull: false },
    contentTypeId: { type: DataTypes.INTEGER, allowNull: false },
    schemaVersion: { type: DataTypes.INTEGER, allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false },
    title: { type: DataTypes.STRING(240), allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'published'), allowNull: false, defaultValue: 'draft' },
    data: { type: DataTypes.JSON, allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
  }, { sequelize, modelName: 'ContentEntry', tableName: 'content_entries', underscored: true });
  return ContentEntry;
};
