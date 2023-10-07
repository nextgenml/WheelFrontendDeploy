"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("twitter_campaigns", "level_1_end_date", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_2_end_date", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_3_end_date", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_4_end_date", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_5_end_date", {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn("twitter_campaigns", "hash_tags", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("twitter_campaigns", "level_1_end_date");
    await queryInterface.removeColumn("twitter_campaigns", "level_2_end_date");
    await queryInterface.removeColumn("twitter_campaigns", "level_3_end_date");
    await queryInterface.removeColumn("twitter_campaigns", "level_4_end_date");
    await queryInterface.removeColumn("twitter_campaigns", "level_5_end_date");

    await queryInterface.removeColumn("twitter_campaigns", "hash_tags");
  },
};
