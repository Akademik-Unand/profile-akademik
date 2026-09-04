'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LandingGalleryItem extends Model {
    static associate(models) {
      LandingGalleryItem.belongsTo(models.LandingPage, { foreignKey: 'landingPageId', as: 'landingPage' });
      LandingGalleryItem.belongsTo(models.Media, { foreignKey: 'mediaId', as: 'media' });
    }
  }

  LandingGalleryItem.init(
    {
      landingPageId: { type: DataTypes.INTEGER, allowNull: false },
      mediaId: { type: DataTypes.INTEGER, allowNull: true },
      caption: { type: DataTypes.TEXT, allowNull: true },
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'LandingGalleryItem',
      tableName: 'landing_gallery_items',
      underscored: true,
    },
  );

  return LandingGalleryItem;
};
