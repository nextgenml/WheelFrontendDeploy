"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("saved_prompts", "hashword", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("saved_prompts", "keyword", {
      type: Sequelize.STRING(2000),
    });
    await queryInterface.changeColumn("saved_prompts", "image_urls", {
      type: Sequelize.STRING(2000),
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
