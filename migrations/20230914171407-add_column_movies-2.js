"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user_movies", "c_movie_time");
    await queryInterface.removeColumn("user_movies", "c_utc_time");
    await queryInterface.addColumn("user_movies", "c_movie_time", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn("user_movies", "c_utc_time", {
      type: Sequelize.STRING(255),
    });
  },

  async down(queryInterface, Sequelize) {},
};
