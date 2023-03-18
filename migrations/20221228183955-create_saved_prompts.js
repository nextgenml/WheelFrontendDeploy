"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("saved_prompts1", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      transactionID: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      wallet_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      initiative: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      prompt: {
        type: Sequelize.STRING(255),
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("saved_prompts1");
  },
};
