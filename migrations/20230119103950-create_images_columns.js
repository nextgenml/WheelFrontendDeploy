"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "campaign_details",
      "image_urls",
      Sequelize.TEXT
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaign_details", "image_urls");
  },
};
