"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("saved_prompts", "details", {
      type: Sequelize.STRING(300),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("saved_prompts", "details", {
      type: Sequelize.STRING(300),
    });
  },
};
