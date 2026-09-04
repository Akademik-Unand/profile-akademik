'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const url = { type: Sequelize.STRING(500), allowNull: true };
    await queryInterface.addColumn('units', 'facebook_url', url);
    await queryInterface.addColumn('units', 'instagram_url', url);
    await queryInterface.addColumn('units', 'twitter_url', url);
    await queryInterface.addColumn('units', 'youtube_url', url);
    await queryInterface.addColumn('units', 'tiktok_url', url);
    await queryInterface.addColumn('units', 'linkedin_url', url);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('units', 'linkedin_url');
    await queryInterface.removeColumn('units', 'tiktok_url');
    await queryInterface.removeColumn('units', 'youtube_url');
    await queryInterface.removeColumn('units', 'twitter_url');
    await queryInterface.removeColumn('units', 'instagram_url');
    await queryInterface.removeColumn('units', 'facebook_url');
  },
};
