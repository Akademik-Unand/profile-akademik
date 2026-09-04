'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'menus', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      label: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.ENUM('page', 'post_category', 'external_url'), allowNull: false },
      target_page_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'pages', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      target_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'post_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      external_url: { type: Sequelize.STRING, allowNull: true },
      order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('menus', ['unit_id', 'order'], { name: 'menus_unit_order_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('menus');
  },
};
