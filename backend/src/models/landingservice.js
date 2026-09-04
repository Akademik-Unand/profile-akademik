'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LandingService extends Model {
    static associate(models) {
      LandingService.belongsTo(models.LandingPage, { foreignKey: 'landingPageId', as: 'landingPage' });
    }
  }

  LandingService.init(
    {
      landingPageId: { type: DataTypes.INTEGER, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.STRING, allowNull: true },
      url: { type: DataTypes.STRING, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'LandingService',
      tableName: 'landing_services',
      underscored: true,
    },
  );

  return LandingService;
};
