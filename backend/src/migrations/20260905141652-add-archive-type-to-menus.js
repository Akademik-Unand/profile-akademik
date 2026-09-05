'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TABLE menus MODIFY COLUMN type ENUM('page', 'post_category', 'external_url', 'archive') NOT NULL",
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      "UPDATE menus SET type = 'external_url' WHERE type = 'archive'",
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE menus MODIFY COLUMN type ENUM('page', 'post_category', 'external_url') NOT NULL",
    );
  },
};
