"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "saved_prompts",
      "promoted_wallet",
      Sequelize.STRING
    );
    await queryInterface.addColumn(
      "saved_prompts",
      "promoted_blog_id",
      Sequelize.INTEGER
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("saved_prompts", "promoted_wallet");
    await queryInterface.removeColumn("saved_prompts", "promoted_blog_id");
  },
};
