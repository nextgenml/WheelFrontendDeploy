"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movie_referrals", {
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
      complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      invite_code: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movie_referrals");
  },
};
