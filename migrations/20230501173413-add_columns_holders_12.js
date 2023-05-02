"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "minimum_balance_for_ai", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.addColumn("holders", "is_banned", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "minimum_balance_for_ai");
    await queryInterface.removeColumn("holders", "is_banned");
  },
};
