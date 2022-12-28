"use strict";

const moment = require("moment");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("campaigns", [
      {
        campaign: "Nike",
        start_time: moment().format(),
        end_time: moment().add(100, "days").format(),
        minimum_check: 1,
        success_factor: "high",
        is_active: 1,
      },
      {
        campaign: "Adidas",
        start_time: moment().format(),
        end_time: moment().add(100, "days").format(),
        minimum_check: 1,
        success_factor: "high",
        is_active: 1,
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
