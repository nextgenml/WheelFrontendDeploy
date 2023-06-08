"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "nml_holders",
      "is_diamond",
      Sequelize.SMALLINT
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("nml_holders", "is_diamond");
  },
};
