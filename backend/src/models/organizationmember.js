'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrganizationMember extends Model {
    static associate(models) {
      OrganizationMember.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
      OrganizationMember.belongsTo(models.Media, { foreignKey: 'photoMediaId', as: 'photo' });
      OrganizationMember.belongsTo(models.OrganizationMember, { foreignKey: 'parentId', as: 'parent' });
      OrganizationMember.hasMany(models.OrganizationMember, { foreignKey: 'parentId', as: 'children' });
    }
  }

  OrganizationMember.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      photoMediaId: { type: DataTypes.INTEGER, allowNull: true },
      parentId: { type: DataTypes.INTEGER, allowNull: true },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: 'OrganizationMember',
      tableName: 'organization_members',
      underscored: true,
    },
  );

  return OrganizationMember;
};
