"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("wallets", "value", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("tokens", "decimals", {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("wallets", "value");
  },
};
