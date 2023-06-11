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
    // await queryInterface.addIndex("chores", ["id"]);
    // await queryInterface.addIndex("holders", ["id"]);
    // await queryInterface.addIndex("holders", ["wallet_id"]);
    await queryInterface.addIndex("chores", ["wallet_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("chores", ["id"]);
    await queryInterface.removeIndex("holders", ["id"]);
    await queryInterface.removeIndex("holders", ["wallet_id"]);
    await queryInterface.removeIndex("chores", ["wallet_id"]);
  },
};
