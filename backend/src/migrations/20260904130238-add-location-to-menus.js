'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('menus', 'location', {
      type: Sequelize.ENUM('header', 'footer'),
      allowNull: false,
      defaultValue: 'header',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('menus', 'location');
  },
};
