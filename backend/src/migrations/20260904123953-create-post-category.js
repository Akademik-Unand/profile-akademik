'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_categories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('post_categories', ['unit_id', 'slug'], {
      unique: true,
      name: 'post_categories_unit_slug_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('post_categories');
  },
};
