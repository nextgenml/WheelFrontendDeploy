"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("token_transactions", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      block_number: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      from_wallet: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      to_wallet: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      value: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      transaction_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("token_transactions");
  },
};
