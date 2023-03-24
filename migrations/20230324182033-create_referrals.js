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
      referee: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      referred_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paid_referer: {
        type: Sequelize.SMALLINT,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("referrals");
  },
};
