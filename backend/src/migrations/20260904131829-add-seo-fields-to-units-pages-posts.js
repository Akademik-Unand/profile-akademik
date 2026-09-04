'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('units', 'seo_title', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('units', 'seo_description', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('units', 'seo_keywords', { type: Sequelize.STRING, allowNull: true });

    await queryInterface.addColumn('pages', 'meta_title', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('pages', 'meta_description', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('pages', 'meta_keywords', { type: Sequelize.STRING, allowNull: true });

    await queryInterface.addColumn('posts', 'meta_title', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('posts', 'meta_description', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('posts', 'meta_keywords', { type: Sequelize.STRING, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('posts', 'meta_keywords');
    await queryInterface.removeColumn('posts', 'meta_description');
    await queryInterface.removeColumn('posts', 'meta_title');
    await queryInterface.removeColumn('pages', 'meta_keywords');
    await queryInterface.removeColumn('pages', 'meta_description');
    await queryInterface.removeColumn('pages', 'meta_title');
    await queryInterface.removeColumn('units', 'seo_keywords');
    await queryInterface.removeColumn('units', 'seo_description');
    await queryInterface.removeColumn('units', 'seo_title');
  },
};
