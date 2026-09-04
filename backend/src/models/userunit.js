'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserUnit extends Model {
    static associate() {
      // Pivot only — associations live on User and Unit.
    }
  }

  UserUnit.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      unitId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserUnit',
      tableName: 'user_units',
      underscored: true,
      timestamps: false,
    },
  );

  return UserUnit;
};
