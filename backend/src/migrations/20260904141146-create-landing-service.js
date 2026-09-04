'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landing_services', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      landing_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'landing_pages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      label: { type: Sequelize.STRING, allowNull: false },
      icon: { type: Sequelize.STRING, allowNull: true },
      url: { type: Sequelize.STRING, allowNull: false },
      order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('landing_services', ['landing_page_id', 'order'], {
      name: 'landing_services_page_order_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('landing_services');
  },
};
