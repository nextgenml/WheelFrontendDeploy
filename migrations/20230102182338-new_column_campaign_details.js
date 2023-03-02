"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      "campaign_details",
      "last_checked_date",
      Sequelize.DATE
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("campaign_details", "last_checked_date");
  },
};
