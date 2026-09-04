'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    static associate(models) {
      Agenda.belongsTo(models.Unit, { foreignKey: 'unitId', as: 'unit' });
    }
  }

  Agenda.init(
    {
      unitId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false },
      startsAt: { type: DataTypes.DATE, allowNull: false },
      endsAt: { type: DataTypes.DATE, allowNull: true },
      timeText: { type: DataTypes.STRING, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
    },
    {
      sequelize,
      modelName: 'Agenda',
      tableName: 'agendas',
      underscored: true,
    },
  );

  return Agenda;
};
