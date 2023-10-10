"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET NAMES utf8mb4;");
    await queryInterface.sequelize.query(
      "ALTER DATABASE nextgenml CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE twitter_chores CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE twitter_chores CHANGE content content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );

    await queryInterface.sequelize.query(
      "ALTER TABLE twitter_campaigns CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE twitter_campaigns CHANGE content content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
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
