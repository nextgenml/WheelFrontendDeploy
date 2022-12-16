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

  if (process.argv.includes("run_migrations")) {
    console.log("running db migrations");
    const scheduled_spins = `create table scheduled_spins (
      id int primary key auto_increment,
      frequency varchar(255) not null,
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

    const spins = `create table spins (
      id int primary key auto_increment,
      type varchar(255) not null,
      spin_day DATE not null,
      spin_no SMALLINT not null,
      created_at datetime not null,
      updated_at datetime not null)`;
    dbConnection.query(spins, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("created table spins");
    });
    console.log("Connected to the MySQL server.");
    const deleteQuery = "DROP TABLE IF EXISTS participants;";
    dbConnection.query(deleteQuery, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("dropped table participants");
    });
    const participants = `create table participants (
      id int primary key auto_increment,
      transaction_id varchar(255) not null,
      type varchar(255) not null,
      is_winner TINYINT,
      win_at DATETIME,
      spin_at DATETIME,
      spin_day DATE,
      spin_no SMALLINT,
      paid_flag TINYINT,
      value INT,
      winning_rank SMALLINT
    )`;
    dbConnection.query(participants, function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else console.log("created table participants");
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
