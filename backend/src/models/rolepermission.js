'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId', as: 'permission' });
    }
  }

  RolePermission.init(
    {
      role: { type: DataTypes.ENUM('superadmin', 'admin_unit'), allowNull: false },
      permissionId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'role_permissions',
      underscored: true,
    },
  );

  return RolePermission;
};
