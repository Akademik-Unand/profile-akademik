'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const stringCol = { type: Sequelize.STRING, allowNull: true };
    await queryInterface.addColumn('landing_pages', 'news_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'announcements_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'agenda_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'services_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'gallery_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'gallery_subtitle', { type: Sequelize.STRING(500), allowNull: true });
    await queryInterface.addColumn('landing_pages', 'units_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'contact_title', stringCol);
    await queryInterface.addColumn('landing_pages', 'contact_body', { type: Sequelize.TEXT, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('landing_pages', 'contact_body');
    await queryInterface.removeColumn('landing_pages', 'contact_title');
    await queryInterface.removeColumn('landing_pages', 'units_title');
    await queryInterface.removeColumn('landing_pages', 'gallery_subtitle');
    await queryInterface.removeColumn('landing_pages', 'gallery_title');
    await queryInterface.removeColumn('landing_pages', 'services_title');
    await queryInterface.removeColumn('landing_pages', 'agenda_title');
    await queryInterface.removeColumn('landing_pages', 'announcements_title');
    await queryInterface.removeColumn('landing_pages', 'news_title');
  },
};
