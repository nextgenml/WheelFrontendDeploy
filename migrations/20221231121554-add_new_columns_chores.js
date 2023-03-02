"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("chores", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      campaign_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wallet_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      media_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      chore_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_completed: {
        type: Sequelize.SMALLINT,
        defaultValue: false,
      },
      is_paid: {
        type: Sequelize.SMALLINT,
        defaultValue: false,
      },
      link_to_post: {
        type: Sequelize.STRING(255),
      },
      media_post_id: {
        type: Sequelize.STRING(255),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("chores");
  },
};
