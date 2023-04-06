"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      amount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      earned_at: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      details: {
        type: Sequelize.STRING,
      },
      wallet_id: {
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
