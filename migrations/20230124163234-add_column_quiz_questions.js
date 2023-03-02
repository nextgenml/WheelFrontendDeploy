"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "quiz_submissions",
      "wallet_id",
      Sequelize.STRING(255)
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "quiz_submissions",
      "wallet_id",
      Sequelize.STRING(255)
    );
  },
};
