'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MediaFolder extends Model {
    static associate(models) {
      MediaFolder.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      MediaFolder.hasMany(models.Media, { foreignKey: 'folderId', as: 'files' });
    }
  }

  MediaFolder.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'MediaFolder',
      tableName: 'media_folders',
      underscored: true,
    },
  );

  return MediaFolder;
};
