'use strict';

const { ensureSystemPagesForAllScopes } = require('../helpers/systemPages');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const { User } = require('../models');
    const admin = await User.findOne({ where: { email: 'admin@unand.ac.id' } });
    await ensureSystemPagesForAllScopes({ createdBy: admin?.id || null });
  },

  async down(queryInterface) {
    const { Op } = require('sequelize');
    await queryInterface.bulkDelete('pages', { slug: { [Op.in]: ['pengumuman', 'organisasi', 'agenda'] } });
  },
};
