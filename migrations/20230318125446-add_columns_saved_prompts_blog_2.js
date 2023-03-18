"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("saved_prompts", "mediumurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "twitterurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "facebookurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "linkedinurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "instagramurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "pinteresturl", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("saved_prompts", "hashword", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.addColumn("saved_prompts", "keyword", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.addColumn("saved_prompts", "image_urls", {
      type: Sequelize.STRING(1000),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("saved_prompts", "mediumurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "twitterurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "facebookurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "linkedinurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "instagramurl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "pinteresturl", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("saved_prompts", "hashword", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.removeColumn("saved_prompts", "keyword", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.removeColumn("saved_prompts", "image_urls", {
      type: Sequelize.STRING(1000),
    });
  },
};
