"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("media_posts", {
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
      campaign_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      media_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      link_to_post: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      media_post_id: {
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("media_posts");
  },
};
