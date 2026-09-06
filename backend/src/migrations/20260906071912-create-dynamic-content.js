'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('content_types', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        unit_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'CASCADE' },
        scope_key: { type: Sequelize.STRING(32), allowNull: false },
        key: { type: Sequelize.STRING(80), allowNull: false },
        name: { type: Sequelize.STRING(160), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
        active_version: { type: Sequelize.INTEGER, allowNull: true },
        list_template: { type: Sequelize.JSON, allowNull: true },
        detail_template: { type: Sequelize.JSON, allowNull: true },
        created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }, { transaction });
      await queryInterface.addIndex('content_types', ['scope_key', 'key'], { unique: true, name: 'content_types_scope_key_unique', transaction });
      await queryInterface.addIndex('content_types', ['unit_id'], { transaction });

      await queryInterface.createTable('content_type_versions', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        content_type_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'content_types', key: 'id' }, onDelete: 'CASCADE' },
        version: { type: Sequelize.INTEGER, allowNull: false },
        schema: { type: Sequelize.JSON, allowNull: false },
        status: { type: Sequelize.ENUM('draft', 'published'), allowNull: false, defaultValue: 'draft' },
        created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
        published_at: { type: Sequelize.DATE, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }, { transaction });
      await queryInterface.addIndex('content_type_versions', ['content_type_id', 'version'], { unique: true, transaction });

      await queryInterface.createTable('content_entries', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        unit_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'CASCADE' },
        scope_key: { type: Sequelize.STRING(32), allowNull: false },
        content_type_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'content_types', key: 'id' }, onDelete: 'CASCADE' },
        schema_version: { type: Sequelize.INTEGER, allowNull: false },
        slug: { type: Sequelize.STRING(120), allowNull: false },
        title: { type: Sequelize.STRING(240), allowNull: false },
        status: { type: Sequelize.ENUM('draft', 'published'), allowNull: false, defaultValue: 'draft' },
        data: { type: Sequelize.JSON, allowNull: false },
        created_by: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
        published_at: { type: Sequelize.DATE, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
      }, { transaction });
      await queryInterface.addIndex('content_entries', ['content_type_id', 'scope_key', 'slug'], { unique: true, name: 'content_entries_type_scope_slug_unique', transaction });
      await queryInterface.addIndex('content_entries', ['unit_id', 'content_type_id', 'status', 'published_at'], { name: 'content_entries_public_lookup', transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('content_entries', { transaction });
      await queryInterface.dropTable('content_type_versions', { transaction });
      await queryInterface.dropTable('content_types', { transaction });
    });
  },
};
