"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET NAMES utf8mb4;");
    await queryInterface.addColumn("chores", "content", Sequelize.STRING);
    await queryInterface.sequelize.query(
      "ALTER TABLE chores CHANGE content content VARCHAR(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
    await queryInterface.addColumn(
      "campaigns",
      "is_recursive_algo",
      Sequelize.BOOLEAN
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("chores", "content");
  },
};
