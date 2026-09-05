'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pages', 'builder', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('pages', 'layout', { type: Sequelize.JSON, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('pages', 'layout');
    await queryInterface.removeColumn('pages', 'builder');
  },
};
