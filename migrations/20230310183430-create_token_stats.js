"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tokens", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      last_block_number: {
        type: Sequelize.STRING(255),
        defaultValue: 0,
      },
      own_token: {
        type: Sequelize.SMALLINT,
        defaultValue: 0,
      },
      contract_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      abi_file: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("tokens");
  },
};
