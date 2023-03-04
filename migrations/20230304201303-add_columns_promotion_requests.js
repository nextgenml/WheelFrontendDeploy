"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "promotion_requests",
      "used",
      Sequelize.INTEGER
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("promotion_requests", "used");
  },
};
