"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "is_diamond", {
      type: Sequelize.SMALLINT,
    });
    await queryInterface.addColumn("scheduled_spins", "is_diamond", {
      type: Sequelize.SMALLINT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "is_diamond");
    await queryInterface.removeColumn("scheduled_spins", "is_diamond");
  },
};
