'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('units', 'cover_media_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'media', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('units', 'cover_media_id');
  },
};
