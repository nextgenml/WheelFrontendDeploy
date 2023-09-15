"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_movies", "ticket_image_path", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn("user_movies", "hall_image_path", {
      type: Sequelize.STRING(255),
    });
    await queryInterface.addColumn("user_movies", "posture_image_path", {
      type: Sequelize.STRING(255),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user_movies", "ticket_image_path");
    await queryInterface.removeColumn("user_movies", "hall_image_path");
    await queryInterface.removeColumn("user_movies", "posture_image_path");
  },
};
