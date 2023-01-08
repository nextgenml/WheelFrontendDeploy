"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "holders",
      "twitter_id",
      Sequelize.STRING(255)
    );

    await queryInterface.addColumn(
      "campaigns",
      "wallet_id",
      Sequelize.STRING(255)
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "twitter_id");
    await queryInterface.removeColumn("campaigns", "wallet_id");
  },
};
