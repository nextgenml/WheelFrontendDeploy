"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("holders", ["wallet_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("holders", ["wallet_id"]);
  },
};
