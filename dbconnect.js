let mysql = require("mysql");
const logger = require("./logger");
const config = require("./config/env");

let dbConnection = null;

function handleDisconnect() {
  dbConnection = mysql.createConnection({
    host: config.DB_HOST,
    user: "root",
    password: "password",
    database: "nextgenml",
  });

  dbConnection.connect(function (err) {
    if (process.argv.includes("create_saved_prompts")) {
      const deleteQuery = "DROP TABLE IF EXISTS saved_prompts;";
      dbConnection.query(deleteQuery, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("dropped table saved_prompts");
      });
      const spins = `create table saved_prompts (
        id int primary key auto_increment,
        transactionID varchar(255),
        wallet_address varchar(255),
        initiative varchar(255),
        prompt varchar(255),
        blog text,
        mediumurl varchar(255),
        twitterurl varchar(255),
        facebookurl varchar(255),
        linkedinurl varchar(255),
        instagramurl varchar(255),
        pinteresturl varchar(255),
        hashword varchar(1000),
        keyword varchar(1000),
        image_urls varchar(1000),
        create_date DATETIME,
        validated_flag BOOLEAN,
        paid_amount DOUBLE,
        paid_flag BOOLEAN)`;

      dbConnection.query(spins, function (err) {
        if (err) {
          logger.info("err", err);
        } else logger.info("created done");
      });
    }

    //  Warning: Do not uncomment and run the code, this will delete the data in all tables.
    const deleteQuery = "update spins set running = 0;";
    dbConnection.query(deleteQuery, function (err) {
      if (err) {
        logger.info(err.message);
      }
    });
    if (process.argv.includes("wallets")) {
      const deleteQuery = "DROP TABLE IF EXISTS wallets;";
      dbConnection.query(deleteQuery, function (err) {
        if (err) {
          logger.info(err.message);
        }
      });
      const spins = `create table wallets (
        id int primary key auto_increment,
        wallet_id varchar(255),
        value INT,
        created_at DATETIME)`;
      dbConnection.query(spins, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("created table wallets");
      });
    }
    if (process.argv.includes("repopulate_spins")) {
      const delete_all = `delete from scheduled_spins;`;
      dbConnection.query(delete_all, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("created table scheduled_spins");
      });

      const inserts = [
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('weekly', 1, '16:0', '6', 100, 3, 20, '1,1,1');`,

        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('daily', 1, '3:00', null, 100, 3, 20, '1,1,1');`,
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('daily', 1, '9:00', null, 100, 3, 20, '1,1,1');`,
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('daily', 1, '15:00', null, 100, 3, 20, '1,1,1');`,
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('daily', 1, '21:00', null, 100, 3, 20, '1,1,1');`,

        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('biweekly', 1, '17:00', '14:28', 100, 1, 20, '1');`,

        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('monthly', 1, '18:00', '1', 100, 1, 20, '1');`,

        // spin_day: dd:mm
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes) values('yearly', 1, '19:00', '1:1', 100, 1, 20, '1');`,

        // Insert new record for every new adhoc spin
        `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes, participants) values('adhoc', 0, '15:00:0', '1:1:2023', 10000, 1, 15, '100', 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y');`,
      ];
      inserts.forEach((insert) =>
        dbConnection.query(insert, function (err) {
          if (err) {
            logger.info(err.message);
          } else logger.info("inserted");
        })
      );
    }

    if (process.argv.includes("create_spins")) {
      const deleteQuery = "DROP TABLE IF EXISTS spins;";
      dbConnection.query(deleteQuery, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("dropped table spins");
      });
      const spins = `create table spins (
        id int primary key auto_increment,
        type varchar(255) not null,
        spin_day DATE not null,
        spin_no SMALLINT not null,
        scheduled_spin_id INT not null,
        running TINYINT)`;
      dbConnection.query(spins, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("created table spins");
      });
    }

    if (process.argv.includes("create_participants")) {
      const deleteQuery = "DROP TABLE IF EXISTS participants;";
      dbConnection.query(deleteQuery, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("dropped table participants");
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
      dbConnection.query(participants, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("created table participants");
      });
    }
    if (process.argv.includes("scheduled_spins")) {
      const deleteQuery = "DROP TABLE IF EXISTS scheduled_spins;";
      dbConnection.query(deleteQuery, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("dropped table scheduled_spins");
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
        prev_launch_date DATETIME,
        participants TEXT
        )`;
      dbConnection.query(scheduled_spins, function (err) {
        if (err) {
          logger.info(err.message);
        } else logger.info("created table scheduled_spins");
      });
      dbConnection.end(function (err) {
        if (err) {
          return logger.info(err.message);
        } else logger.info("closed connection");
      });
    }
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  dbConnection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();
module.exports = {
  dbConnection,
};
// brew install mysql
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// flush privileges;
// GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION
// npx sequelize-cli migration:create --name create_spin_tables
//  npx sequelize-cli db:migrate
