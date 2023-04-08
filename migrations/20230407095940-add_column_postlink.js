"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaigns", "twitter_post_link");
    await queryInterface.addColumn("campaign_details", "post_link", {
      type: Sequelize.STRING(400),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaign_details", "post_link", {
      type: Sequelize.STRING(400),
    });
  },
};
