'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Unit, {
        through: models.UserUnit,
        foreignKey: 'userId',
        otherKey: 'unitId',
        as: 'units',
      });
      User.hasMany(models.Page, { foreignKey: 'createdBy', as: 'pages' });
      User.hasMany(models.Post, { foreignKey: 'createdBy', as: 'posts' });
      User.hasMany(models.Media, { foreignKey: 'uploadedBy', as: 'uploads' });
    }

    toSafeJSON() {
      const json = this.toJSON();
      delete json.passwordHash;
      return json;
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'admin_unit'),
        allowNull: false,
        defaultValue: 'admin_unit',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['passwordHash'] },
        },
      },
    },
  );

  return User;
};
