let mysql = require("mysql");
const logger = require("./logger");
var config = require("./config/config.json")[
  process.env.NODE_ENV || "development"
];

let dbConnection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
});

dbConnection.connect(function (err) {
  if (err) {
    return logger.error(`error: ${err.message}`);
  }

  const deleteQuery = "update spins set running = 0;";
  dbConnection.query(deleteQuery, function (err) {
    if (err) {
      logger.info(err.message);
    }
  });
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
});

module.exports = {
  dbConnection,
};
// brew install mysql
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// flush privileges;
// npx sequelize-cli migration:create --name create_spin_tables
//  npx sequelize-cli db:migrate
