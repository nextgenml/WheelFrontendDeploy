"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("twitter_campaigns", "deleted_at", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("twitter_campaigns", "wallet_id", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("twitter_campaigns", "deleted_at");
    await queryInterface.removeColumn("twitter_campaigns", "wallet_id");
  },
};
