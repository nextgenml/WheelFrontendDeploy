"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("referrals", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      referer: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      referee_twitter: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      referee_telegram: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      referred_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      criteria_met: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
      },
      criteria_met_at: {
        type: Sequelize.DATE,
      },
      criteria_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      paid_referer: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("referrals");
  },
};
