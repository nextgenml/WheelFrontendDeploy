const fetchAddress = require("../script/tracking");
const moment = require("moment");
const { dbConnection } = require("../dbconnect");
const getTransactionIds = async () => {
  const new_addresses = await fetchAddress();
  console.log("new_addresses", new_addresses);
};

const getParticipants = async (start, end, type) => {
  start = moment(start).startOf("day").format();
  end = moment(end).endOf("day").format();
  const query = `select * from participants where ${
    type === "winners" ? "is_winner = 1 and " : ""
  } spin_day >= '${start}' and spin_day <= '${end}';`;

  let users = await new Promise((resolve, reject) => {
    dbConnection.query(query, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

  return users.map((user) => {
    return {
      day: moment(user.spin_day).format("YYYY-MM-DD"),
      spin: user.spin_no,
      transaction_id: formatTransactionId(user.transaction_id),
      rank: user.winning_rank,
      win_at: user.is_winner
        ? moment(user.win_at).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
    };
  });
};
const getWinners = async (start, end) => {
  start = moment(start).startOf("day").format();
  end = moment(end).endOf("day").format();
  const query = `select * from participants where is_winner = 1 and spin_day >= '${start}' and spin_day <= '${end}';`;

  let users = await new Promise((resolve, reject) => {
    dbConnection.query(query, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

  users = groupByDate(users, "spin_day");

  // console.log("users", users);
  const result = [];
  Object.keys(users).forEach((day) => {
    temp_users = users[day];

    users_by_spin = groupBy(temp_users, "spin_no");

    // console.log("users_by_spin", users_by_spin);
    Object.keys(users_by_spin).forEach((spin) => {
      temp_users2 = users_by_spin[spin];
      // console.log("temp_users2", temp_users2[0].transaction_id);
      result.push({
        day,
        spin,
        first: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 1)[0]?.transaction_id
        ),
        second: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 2)[0]?.transaction_id
        ),
        third: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 3)[0]?.transaction_id
        ),
      });
    });
  });
  // console.log("result", result);
  return result;
};

var groupByDate = function (xs, key) {
  return xs.reduce(function (rv, x) {
    formatted_key = moment(x[key]).format("YYYY-MM-DD");
    (rv[formatted_key] = rv[formatted_key] || []).push(x);
    return rv;
  }, {});
};

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    formatted_key = x[key];
    (rv[formatted_key] = rv[formatted_key] || []).push(x);
    return rv;
  }, {});
};

var formatTransactionId = (transaction_id) =>
  transaction_id.substring(0, 4) +
  "...." +
  transaction_id.substring(transaction_id.length - 4);
module.exports = {
  getTransactionIds,
  getWinners,
  getParticipants,
};
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('97ASDFADSfa11', 1, 'daily', 3, SUBDATE(now(),1), SUBDATE(now(),1), 1, now());
//insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('asdfsdfasf', 1, 'daily', 2, SUBDATE(now(),1), SUBDATE(now(),1), 1, now());
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('4214efsaf', 1, 'daily', 1, SUBDATE(now(),1), SUBDATE(now(),1), 1, now());
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('97ASDFADSfa11', 1, 'daily', 1, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('97ASDFADSfa11', 1, 'daily', 2, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('97ASDFADSfa11', 1, 'daily', 3, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('asdkfjalskjf', 2, 'daily', 1, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('q,kq,jknrqwner', 2, 'daily', 2, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('987a9x70', 3, 'daily', 3, SUBDATE(now(),0), SUBDATE(now(),1), 1, SUBDATE(now(),1));

// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('q,kq,jknrqwner', 2, 'daily', 2, SUBDATE(now(),0), SUBDATE(now(),1), 0, now());
// insert into nextgenml.participants (transaction_id, spin_no, type, winning_rank, win_at, spin_at, is_winner, spin_day) values('987a9x70', 3, 'daily', 3, SUBDATE(now(),0), SUBDATE(now(),1), 0, now());

// update nextgenml.participants set win_at = SUBDATE(now(),1) where id > 3;
// update nextgenml.participants set win_at = SUBDATE(now(),0) where id <= 3;
// update nextgenml.participants set winning_rank = is_winner;
// update nextgenml.participants set is_winner = 1;
