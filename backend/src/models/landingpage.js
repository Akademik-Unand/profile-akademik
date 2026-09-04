'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LandingPage extends Model {
    static associate(models) {
      LandingPage.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      LandingPage.hasMany(models.LandingSlide, { foreignKey: 'landingPageId', as: 'slides' });
      LandingPage.hasMany(models.LandingService, { foreignKey: 'landingPageId', as: 'services' });
      LandingPage.hasMany(models.LandingGalleryItem, { foreignKey: 'landingPageId', as: 'gallery' });
    }
  }

  LandingPage.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true, unique: true },
      eyebrow: { type: DataTypes.STRING, allowNull: true },
      heroTitle: { type: DataTypes.STRING, allowNull: true },
      heroSubtitle: { type: DataTypes.TEXT, allowNull: true },
      ctaLabel: { type: DataTypes.STRING, allowNull: true },
      ctaUrl: { type: DataTypes.STRING, allowNull: true },
      introTitle: { type: DataTypes.STRING, allowNull: true },
      introBody: { type: DataTypes.TEXT, allowNull: true },
      newsTitle: { type: DataTypes.STRING, allowNull: true },
      announcementsTitle: { type: DataTypes.STRING, allowNull: true },
      agendaTitle: { type: DataTypes.STRING, allowNull: true },
      servicesTitle: { type: DataTypes.STRING, allowNull: true },
      galleryTitle: { type: DataTypes.STRING, allowNull: true },
      gallerySubtitle: { type: DataTypes.STRING, allowNull: true },
      unitsTitle: { type: DataTypes.STRING, allowNull: true },
      contactTitle: { type: DataTypes.STRING, allowNull: true },
      contactBody: { type: DataTypes.TEXT, allowNull: true },
      showNews: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      showAgenda: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      showServices: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      showUnits: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      showGallery: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'LandingPage',
      tableName: 'landing_pages',
      underscored: true,
    },
  );

  return LandingPage;
};
