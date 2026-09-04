'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landing_slides', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      landing_page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'landing_pages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      media_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'media', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: { type: Sequelize.STRING, allowNull: true },
      caption: { type: Sequelize.TEXT, allowNull: true },
      link_url: { type: Sequelize.STRING, allowNull: true },
      order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('landing_slides', ['landing_page_id', 'order'], {
      name: 'landing_slides_page_order_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('landing_slides');
  },
};
