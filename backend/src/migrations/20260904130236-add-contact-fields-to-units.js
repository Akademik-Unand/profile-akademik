'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('units', 'address', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('units', 'phone', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('units', 'fax', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('units', 'email', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('units', 'description', { type: Sequelize.TEXT, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('units', 'description');
    await queryInterface.removeColumn('units', 'email');
    await queryInterface.removeColumn('units', 'fax');
    await queryInterface.removeColumn('units', 'phone');
    await queryInterface.removeColumn('units', 'address');
  },
};
