"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("chores", "target_post", {
      type: Sequelize.STRING(400),
    });
    await queryInterface.addColumn("chores", "target_post_link", {
      type: Sequelize.STRING(400),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("chores", "target_post");
    await queryInterface.removeColumn("chores", "target_post_link");
  },
};
