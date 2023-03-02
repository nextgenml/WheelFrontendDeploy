"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await Promise.all([
      queryInterface.addColumn("campaigns", "client", Sequelize.STRING(255)),
      queryInterface.changeColumn(
        "campaign_details",
        "collection_id",
        Sequelize.STRING(255)
      ),
    ]);
  },

  async down(queryInterface) {
    return await Promise.all([
      queryInterface.removeColumn("campaigns", "client"),
    ]);
  },
};
