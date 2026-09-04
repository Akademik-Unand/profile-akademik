'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      Unit.belongsToMany(models.User, {
        through: models.UserUnit,
        foreignKey: 'unitId',
        otherKey: 'userId',
        as: 'admins',
      });
      Unit.belongsTo(models.Media, { foreignKey: 'logoMediaId', as: 'logo' });
      Unit.belongsTo(models.Media, { foreignKey: 'coverMediaId', as: 'cover' });
      Unit.hasMany(models.Page, { foreignKey: 'unitId', as: 'pages' });
      Unit.hasMany(models.Post, { foreignKey: 'unitId', as: 'posts' });
      Unit.hasMany(models.PostCategory, { foreignKey: 'unitId', as: 'postCategories' });
      Unit.hasMany(models.Media, { foreignKey: 'unitId', as: 'media' });
      Unit.hasMany(models.MediaFolder, { foreignKey: 'unitId', as: 'mediaFolders' });
      Unit.hasMany(models.Menu, { foreignKey: 'unitId', as: 'menus' });
      Unit.hasMany(models.OrganizationMember, { foreignKey: 'unitId', as: 'organizationMembers' });
      Unit.hasMany(models.Agenda, { foreignKey: 'unitId', as: 'agendas' });
      Unit.hasOne(models.LandingPage, { foreignKey: 'unitId', as: 'landing' });
    }
  }

  Unit.init(
    {
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      themeColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customCss: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      templateKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logoMediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coverMediaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      address: { type: DataTypes.TEXT, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      fax: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      facebookUrl: { type: DataTypes.STRING, allowNull: true },
      instagramUrl: { type: DataTypes.STRING, allowNull: true },
      twitterUrl: { type: DataTypes.STRING, allowNull: true },
      youtubeUrl: { type: DataTypes.STRING, allowNull: true },
      tiktokUrl: { type: DataTypes.STRING, allowNull: true },
      linkedinUrl: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      seoTitle: { type: DataTypes.STRING, allowNull: true },
      seoDescription: { type: DataTypes.TEXT, allowNull: true },
      seoKeywords: { type: DataTypes.STRING, allowNull: true },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Unit',
      tableName: 'units',
      underscored: true,
    },
  );

  return Unit;
};
