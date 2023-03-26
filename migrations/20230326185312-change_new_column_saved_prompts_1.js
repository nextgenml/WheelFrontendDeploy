"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("saved_prompts", "mediumurl", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("saved_prompts", "twitterurl", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("saved_prompts", "facebookurl", {
      type: Sequelize.STRING(1000),
    });

    await queryInterface.changeColumn("saved_prompts", "linkedinurl", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("saved_prompts", "instagramurl", {
      type: Sequelize.STRING(1000),
    });
    await queryInterface.changeColumn("saved_prompts", "pinteresturl", {
      type: Sequelize.STRING(1000),
    });
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
