"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      "chores",
      "ref_chore_id",
      Sequelize.INTEGER
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("chores", "ref_chore_id");
  },
};
