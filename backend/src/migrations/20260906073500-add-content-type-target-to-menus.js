'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('menus', 'target_content_type_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'content_types', key: 'id' },
        onDelete: 'SET NULL',
      }, { transaction });
      await queryInterface.addIndex('menus', ['target_content_type_id'], { transaction });
      await queryInterface.sequelize.query(
        "ALTER TABLE menus MODIFY COLUMN type ENUM('page', 'post_category', 'external_url', 'archive', 'dynamic_content') NOT NULL",
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        "UPDATE menus SET type = 'external_url', external_url = '#' WHERE type = 'dynamic_content'",
        { transaction },
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE menus MODIFY COLUMN type ENUM('page', 'post_category', 'external_url', 'archive') NOT NULL",
        { transaction },
      );
      await queryInterface.removeColumn('menus', 'target_content_type_id', { transaction });
    });
  },
};
