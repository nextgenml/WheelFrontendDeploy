"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("holders", "volt_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "ape_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "floki_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "elon_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "shib_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "weth_balance", {
      defaultValue: -1,
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("holders", "usdc_balance", {
      defaultValue: -1,
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
