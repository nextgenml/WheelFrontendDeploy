"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tokens", "allocation_percent", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tokens", "allocation_percent", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });
  },
};
