"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tokens", "is_active", {
      type: Sequelize.SMALLINT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tokens", "is_active", {
      type: Sequelize.SMALLINT,
    });
  },
};
