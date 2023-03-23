"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("holders", "facebook_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("holders", "medium_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("holders", "linkedin_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("holders", "twitter_link", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("holders", "facebook_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("holders", "medium_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("holders", "linkedin_link", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("holders", "twitter_link", {
      type: Sequelize.STRING,
    });
  },
};
