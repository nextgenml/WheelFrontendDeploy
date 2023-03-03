"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("promotion_requests", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      receiver_wallet_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      payer_wallet_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      overall_promotions_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      blogs_limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      eth_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      mark_as_done_by_user: {
        type: Sequelize.BOOLEAN,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING(255),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("promotion_requests");
  },
};
