"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "volt_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.addColumn("holders", "floki_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.addColumn("holders", "elon_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.addColumn("holders", "shib_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "volt_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.removeColumn("holders", "floki_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.removeColumn("holders", "elon_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
    await queryInterface.removeColumn("holders", "shib_balance", {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    });
  },
};
