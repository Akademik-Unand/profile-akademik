'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('landing_pages', 'builder', { type: Sequelize.JSON, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('landing_pages', 'builder');
  },
};
