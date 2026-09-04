'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landing_pages', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      eyebrow: { type: Sequelize.STRING, allowNull: true },
      hero_title: { type: Sequelize.STRING, allowNull: true },
      hero_subtitle: { type: Sequelize.TEXT, allowNull: true },
      cta_label: { type: Sequelize.STRING, allowNull: true },
      cta_url: { type: Sequelize.STRING, allowNull: true },
      intro_title: { type: Sequelize.STRING, allowNull: true },
      intro_body: { type: Sequelize.TEXT, allowNull: true },
      show_news: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      show_agenda: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      show_services: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      show_units: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });
    await queryInterface.addIndex('landing_pages', ['unit_id'], {
      unique: true,
      name: 'landing_pages_unit_id_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('landing_pages');
  },
};
