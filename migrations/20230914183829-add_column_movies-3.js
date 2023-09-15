"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("user_movies", "c_movie_date", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn("user_movies", "c_movie_name", {
      type: Sequelize.STRING(255),
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("user_movies", "c_movie_date");
    await queryInterface.removeColumn("user_movies", "c_movie_name");
  },
};
