"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("saved_prompts", "id", {
    //   autoIncrement: true,
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   unique: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("saved_prompts", "id");
  },
};
