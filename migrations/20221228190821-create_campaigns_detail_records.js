"use strict";
const moment = require("moment");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("campaign_details", [
      {
        campaign_id: 1,
        start_time: moment().format(),
        end_time: moment().add(100, "days").format(),
        content:
          "Enrollment for our January 2023 Bootcamp closes on 30th December 2022. You can get into a Tech or Non-Tech career after participating in our Bootcamp. Invest in your career today. Visit",
        is_active: 1,
        content_type: "text",
        media_type: "twitter",
        collection_id: 11341,
      },
      {
        campaign_id: 1,
        start_time: moment().format(),
        end_time: moment().add(100, "days").format(),
        content:
          "Top 5 of the season based on no. of votes a Contestant is likely to get",
        is_active: 1,
        content_type: "text",
        media_type: "twitter",
        collection_id: 1134113,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
