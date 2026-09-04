'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE menus
      SET external_url = '/'
      WHERE external_url IN ('/akademik', '/akademik/')
    `);
    await queryInterface.sequelize.query(`
      UPDATE menus
      SET external_url = REPLACE(external_url, '/akademik/', '/')
      WHERE external_url LIKE '/akademik/%'
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE menus
      SET external_url = CONCAT('/akademik', IF(external_url = '/', '', external_url))
      WHERE external_url IN ('/', '/halaman/profil', '/halaman/kalender-akademik', '/organisasi')
    `);
  },
};
