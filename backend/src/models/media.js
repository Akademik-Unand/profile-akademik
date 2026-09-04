'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      Media.belongsTo(models.MediaFolder, { foreignKey: 'folderId', as: 'folder' });
      Media.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
      Media.hasMany(models.Post, { foreignKey: 'coverMediaId', as: 'coverPosts' });
      Media.hasMany(models.Unit, { foreignKey: 'logoMediaId', as: 'logoUnits' });
      Media.hasMany(models.Unit, { foreignKey: 'coverMediaId', as: 'coverUnits' });
      Media.hasMany(models.OrganizationMember, { foreignKey: 'photoMediaId', as: 'memberPhotos' });
      Media.hasMany(models.LandingSlide, { foreignKey: 'mediaId', as: 'landingSlides' });
      Media.hasMany(models.LandingGalleryItem, { foreignKey: 'mediaId', as: 'landingGalleryItems' });
    }
  }

  Media.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      folderId: { type: DataTypes.INTEGER, allowNull: true },
      filename: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.STRING, allowNull: false },
      thumbnailUrl: { type: DataTypes.STRING, allowNull: true },
      mimeType: { type: DataTypes.STRING, allowNull: false },
      sizeBytes: { type: DataTypes.INTEGER, allowNull: true },
      width: { type: DataTypes.INTEGER, allowNull: true },
      height: { type: DataTypes.INTEGER, allowNull: true },
      altText: { type: DataTypes.STRING, allowNull: true },
      uploadedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Media',
      tableName: 'media',
      underscored: true,
    },
  );

  return Media;
};
