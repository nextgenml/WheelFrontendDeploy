"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("twitter_campaigns", "level_1_target", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_2_target", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_3_target", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_4_target", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_campaigns", "level_5_target", {
      type: Sequelize.INTEGER,
    });

    await queryInterface.addColumn("twitter_chores", "ref_id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("twitter_chores", "source_tweet_link", {
      type: Sequelize.STRING(255),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("twitter_campaigns", "level_1_target");
    await queryInterface.removeColumn("twitter_campaigns", "level_2_target");
    await queryInterface.removeColumn("twitter_campaigns", "level_3_target");
    await queryInterface.removeColumn("twitter_campaigns", "level_4_target");
    await queryInterface.removeColumn("twitter_campaigns", "level_5_target");
    await queryInterface.removeColumn("twitter_chores", "ref_id");
    await queryInterface.removeColumn("twitter_chores", "source_tweet_link");
  },
};
