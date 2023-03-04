"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await Promise.all([
      queryInterface.addColumn("chores", "follow_link", Sequelize.STRING(255)),
      queryInterface.addColumn("chores", "follow_user", Sequelize.STRING(255)),
    ]);
  },

  async down(queryInterface) {
    return await Promise.all([
      queryInterface.removeColumn("chores", "follow_link"),
      queryInterface.removeColumn("chores", "follow_user"),
    ]);
  },
};
