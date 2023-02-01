"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("campaigns", "reward", Sequelize.INTEGER);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaigns", "reward");
  },
};
