"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("wallets", "token", {
      type: Sequelize.STRING,
      defaultValue: "Nexgenml",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("wallets", "token");
  },
};
