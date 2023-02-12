"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "chores",
      "completed_by_user",
      Sequelize.BOOLEAN
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("chores", "completed_by_user");
  },
};
