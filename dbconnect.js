let mysql = require("mysql");

let dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "nextgenml",
});

dbConnection.connect(function (err) {
  // if (err) {
  //   return console.error("error: " + err.message);
  // }
  // console.log("Connected to the MySQL server.");
  // const deleteQuery = "DROP TABLE IF EXISTS participants;";
  // dbConnection.query(deleteQuery, function (err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   } else console.log("dropped table participants");
  // });
  // const participants = `create table participants (
  //   id int primary key auto_increment,
  //   transaction_id varchar(255) not null,
  //   type varchar(255) not null,
  //   is_winner TINYINT,
  //   win_at DATETIME,
  //   spin_at DATETIME,
  //   spin_day DATE,
  //   spin_no SMALLINT,
  //   winning_rank SMALLINT
  // )`;
  // dbConnection.query(participants, function (err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   } else console.log("created table participants");
  // });
  // dbConnection.end(function (err) {
  //   if (err) {
  //     return console.log(err.message);
  //   } else console.log("closed connection");
  // });
});

module.exports = {
  dbConnection,
};
// brew install mysql
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
// flush privileges;
