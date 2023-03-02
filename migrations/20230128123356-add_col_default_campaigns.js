"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "campaigns",
      "is_default",
      Sequelize.SMALLINT
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaigns", "is_default");
  },
};
