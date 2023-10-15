"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("saved_prompts", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      transactionID: {
        type: Sequelize.STRING(255),
      },
      wallet_address: {
        type: Sequelize.STRING(255),
      },
      initiative: {
        type: Sequelize.STRING(255),
      },
      prompt: {
        type: Sequelize.STRING(255),
      },
      blog: {
        type: Sequelize.TEXT,
      },
      create_date: {
        type: Sequelize.DATE,
      },
      validated_flag: {
        type: Sequelize.BOOLEAN,
      },
      paid_amount: {
        type: Sequelize.DOUBLE,
      },
      paid_flag: {
        type: Sequelize.BOOLEAN,
      },
    });
    await queryInterface.addColumn(
      "saved_prompts",
      "promoted",
      Sequelize.SMALLINT
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("saved_prompts", "promoted");
  },
};
