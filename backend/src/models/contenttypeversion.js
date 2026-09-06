'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContentTypeVersion extends Model {
    static associate(models) {
      ContentTypeVersion.belongsTo(models.ContentType, { foreignKey: 'contentTypeId', as: 'contentType' });
      ContentTypeVersion.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    }
  }
  ContentTypeVersion.init({
    contentTypeId: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.INTEGER, allowNull: false },
    schema: { type: DataTypes.JSON, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'published'), allowNull: false, defaultValue: 'draft' },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
  }, { sequelize, modelName: 'ContentTypeVersion', tableName: 'content_type_versions', underscored: true });
  return ContentTypeVersion;
};
