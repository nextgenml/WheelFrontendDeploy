"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("wallets", "value", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "wallet_balance", {
      type: Sequelize.BIGINT,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
