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
    await queryInterface.sequelize.query("SET NAMES utf8mb4;");
    await queryInterface.sequelize.query(
      "ALTER DATABASE nextgenml CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE campaign_details CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE campaign_details CHANGE content content VARCHAR(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE chores CHANGE comment_suggestions comment_suggestions VARCHAR(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
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
