"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("movie_chores", "closed_by_movie_id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("user_movies", "workflow_state", {
      type: Sequelize.STRING(255),
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("movie_chores", "closed_by_movie_id");
    await queryInterface.removeColumn("user_movies", "workflow_state");
  },
};
