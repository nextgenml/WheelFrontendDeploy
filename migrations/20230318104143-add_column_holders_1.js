"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "ape_balance", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("holders", "weth_balance", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("holders", "usdc_balance", {
      type: Sequelize.BIGINT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "ape_balance", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.removeColumn("holders", "weth_balance", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.removeColumn("holders", "usdc_balance", {
      type: Sequelize.BIGINT,
    });
  },
};
