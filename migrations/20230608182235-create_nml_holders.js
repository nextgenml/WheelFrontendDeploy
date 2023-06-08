"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("nml_holders", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      wallet_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      balance: {
        type: Sequelize.BIGINT,
      },
    });
    await queryInterface.createTable("nml_token_transactions", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      wallet_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
      },
    });
    // await queryInterface.addIndex("nml_holders", "wallet_id");
    // await queryInterface.addIndex("nml_token_transactions", "wallet_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("nml_holders");
    await queryInterface.dropTable("nml_token_transactions");
  },
};
