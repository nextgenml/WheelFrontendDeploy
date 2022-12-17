let mysql = require("mysql");

let dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "nextgenml",
});

dbConnection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  //  Warning: Do not uncomment and run the code, this will delete the data in all tables.

  if (process.argv.includes("smart_contract_wallets")) {
    const deleteQuery = "DROP TABLE IF EXISTS smart_contract_wallets;";
    dbConnection.query(deleteQuery, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("dropped table smart_contract_wallets");
    });
    const spins = `create table smart_contract_wallets (
      id int primary key auto_increment,
      wallet_id varchar(255),
      value INT,
      created_at DATETIME)`;
    dbConnection.query(spins, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("created table smart_contract_wallets");
    });
  }
  if (process.argv.includes("repopulate_spins")) {
    const delete_all = `delete from scheduled_spins;`;
    dbConnection.query(delete_all, function (err) {
      if (err) {
        console.log(err.message);
      } else console.log("created table scheduled_spins");
    });

    const inserts = [
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('weekly', 1, '3:00:0', '6', 10000, 3, 20, '100,50,25');`,
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('daily', 1, '15:00:0', null, 10000, 2, 15, '100,50');`,
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('biweekly', 1, '15:00:0', '17:28', 10000, 1, 15, '100');`,
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('monthly', 1, '15:00:0', '1', 10000, 1, 15, '100');`,
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('yearly', 1, '15:00:0', '1:1', 10000, 1, 15, '100');`,
      `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('adhoc', 1, '15:00:0', '1:1:2023', 10000, 1, 15, '100');`,
    ];
    inserts.forEach((insert) =>
      dbConnection.query(insert, function (err) {
        if (err) {
          console.log(err.message);
        } else console.log("inserted");
      })
    );
  }

  if (process.argv.includes("create_spins")) {
    const deleteQuery = "DROP TABLE IF EXISTS spins;";
    dbConnection.query(deleteQuery, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("dropped table spins");
    });
    const spins = `create table spins (
      id int primary key auto_increment,
      type varchar(255) not null,
      spin_day DATE not null,
      spin_no SMALLINT not null,
      scheduled_spin_id INT not null,
      to_be_run TINYINT not null,
      running TINYINT not null,
      started_at DATETIME,
      ended_at DATETIME,
      created_at datetime not null,
      updated_at datetime not null)`;
    dbConnection.query(spins, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("created table spins");
    });
  }
  if (process.argv.includes("create_participants")) {
    const deleteQuery = "DROP TABLE IF EXISTS participants;";
    dbConnection.query(deleteQuery, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("dropped table participants");
    });
    const participants = `create table participants (
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
    )`;
    dbConnection.query(participants, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("created table participants");
    });
  }
  if (process.argv.includes("scheduled_spins")) {
    const deleteQuery = "DROP TABLE IF EXISTS scheduled_spins;";
    dbConnection.query(deleteQuery, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("dropped table scheduled_spins");
    });

    const scheduled_spins = `create table scheduled_spins (
      id int primary key auto_increment,
      type varchar(255) not null,
      is_active TINYINT not null,
      run_at varchar(255) not null,
      spin_day varchar(255),
      min_wallet_amount INT,
      no_of_winners TINYINT not null,
      spin_delay SMALLINT,
      winner_prizes varchar(255),
      prev_launch_date DATETIME
      )`;
    dbConnection.query(scheduled_spins, function (err) {
      if (err) {
        console.log(err.message);
      } else console.log("created table scheduled_spins");
    });

    dbConnection.end(function (err) {
      if (err) {
        return console.log(err.message);
      } else console.log("closed connection");
    });
  }
});

module.exports = {
  dbConnection,
};
// brew install mysql
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// flush privileges;
