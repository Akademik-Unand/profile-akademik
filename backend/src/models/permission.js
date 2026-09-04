'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.hasMany(models.RolePermission, { foreignKey: 'permissionId', as: 'grants' });
    }
  }

  Permission.init(
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      action: { type: DataTypes.STRING, allowNull: false },
      subject: { type: DataTypes.STRING, allowNull: false },
      group: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      underscored: true,
    },
  );

  return Permission;
};
