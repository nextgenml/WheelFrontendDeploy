"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "social_links_updated_at", {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("holders", "social_links_updated_at");
  },
};
