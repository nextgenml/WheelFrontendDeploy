"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`drop table wallets;`);
    await queryInterface.sequelize.query(`drop table spins;`);
    await queryInterface.sequelize.query(`drop table participants;`);
    await queryInterface.sequelize.query(`drop table scheduled_spins;`);

    await queryInterface.sequelize.query(`create table wallets (
      id int primary key auto_increment,
      wallet_id varchar(255),
      value INT,
      created_at DATETIME)`);
    await queryInterface.sequelize.query(`create table spins (
      id int primary key auto_increment,
      type varchar(255) not null,
      spin_day DATE not null,
      spin_no SMALLINT not null,
      scheduled_spin_id INT not null,
      running TINYINT)`);

    await queryInterface.sequelize.query(`create table participants (
        id int primary key auto_increment,
        wallet_id varchar(255) not null,
        type varchar(255) not null,
        is_winner TINYINT,
        win_at DATETIME,
        spin_at DATETIME,
        spin_day DATE,
        spin_no SMALLINT,
        paid_flag TINYINT,
        value INT,
        winning_rank SMALLINT,
        prize INT
      )`);

    await queryInterface.sequelize.query(`create table scheduled_spins (
          id int primary key auto_increment,
          type varchar(255) not null,
          is_active TINYINT not null,
          run_at varchar(255) not null,
          spin_day varchar(255),
          min_wallet_amount INT,
          no_of_winners TINYINT not null,
          spin_delay SMALLINT,
          winner_prizes varchar(255),
          prev_launch_date DATETIME,
          participants TEXT
          )`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
