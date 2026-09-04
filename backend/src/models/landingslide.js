'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LandingSlide extends Model {
    static associate(models) {
      LandingSlide.belongsTo(models.LandingPage, { foreignKey: 'landingPageId', as: 'landingPage' });
      LandingSlide.belongsTo(models.Media, { foreignKey: 'mediaId', as: 'media' });
    }
  }

  LandingSlide.init(
    {
      landingPageId: { type: DataTypes.INTEGER, allowNull: false },
      mediaId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: true },
      caption: { type: DataTypes.TEXT, allowNull: true },
      linkUrl: { type: DataTypes.STRING, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'LandingSlide',
      tableName: 'landing_slides',
      underscored: true,
    },
  );

  return LandingSlide;
};
