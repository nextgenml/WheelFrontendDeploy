"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_movies", {
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
      movie_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      movie_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      c_hall_name: {
        type: Sequelize.STRING(255),
      },
      c_movie_time: {
        type: Sequelize.DATE,
      },
      c_seat_number: {
        type: Sequelize.STRING(255),
      },
      c_city: {
        type: Sequelize.STRING(255),
      },
      c_state: {
        type: Sequelize.STRING(255),
      },
      c_country: {
        type: Sequelize.STRING(255),
      },
      c_utc_time: {
        type: Sequelize.DATE,
      },
      c_others: {
        type: Sequelize.STRING(1000),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_movies");
  },
};
