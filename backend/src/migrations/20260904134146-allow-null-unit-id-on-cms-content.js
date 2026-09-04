'use strict';

const TABLES = ['pages', 'posts', 'agendas', 'organization_members'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await Promise.all(
      TABLES.map((table) =>
        queryInterface.sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`unit_id\` INTEGER NULL`),
      ),
    );
  },

  async down(queryInterface) {
    await Promise.all(
      TABLES.map((table) =>
        queryInterface.sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`unit_id\` INTEGER NOT NULL`),
      ),
    );
  },
};
