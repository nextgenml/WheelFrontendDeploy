"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("twitter_chores", "campaign_id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_chores", "validated", {
      type: Sequelize.BOOLEAN,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("twitter_chores", "campaign_id");
    await queryInterface.removeColumn("twitter_chores", "validated");
  },
};
