const moment = require("moment");
const {
  formatTransactionId,
  groupByDate,
  groupBy,
  executeQueryAsync,
  runQueryAsync,
} = require("../utils/spinwheelUtil");

const markWinnerAsPaid = async (wallet_id) => {
  const update = `update participants set paid_flag = 1 where wallet_id = ${wallet_id};`;
  await executeQueryAsync(update);
};

const markAsWinner = async (id, rank, prize) => {
  const update = `update participants set win_at = now(), is_winner = 1, winning_rank = ?, prize = ? where id = ?;`;
  await runQueryAsync(update, [rank, prize, id]);
};
const currentSpinData = async (spin_no) => {
  spin_day = moment().format("YYYY-MM-DD");
  const query = `select * from participants where spin_no = ${spin_no} and spin_day = '${spin_day}' order by value desc limit 25;`;
  let users = await executeQueryAsync(query);

  const addresses = users.map((user) => formatTransactionId(user.wallet_id));

  const spinQuery = `select * from spins where spin_no = ${spin_no} and spin_day = '${spin_day}';`;

  let spins = await executeQueryAsync(spinQuery);

  const spin = spins[0];
  if (!spin) return;
  return {
    items: addresses,
    created_at: spin.created_at,
    updated_at: spin.updated_at,
  };
};

const getSpin = async (spin_no) => {
  spin_day = moment().format("YYYY-MM-DD");
  const spin = `select * from spins where spin_no = ${spin_no} and spin_day = '${spin_day}';`;

  let users = await executeQueryAsync(spin);
  return users[0];
};

const dataExistsForCurrentSpin = async (spin_no) => {
  spin_day = moment().format("YYYY-MM-DD");
  const query = `select * from participants where spin_no = ${spin_no} and spin_day = '${spin_day}';`;

  let users = await executeQueryAsync(query);

  return users.length > 0;
};
const createParticipant = async (wallet_id, value, nextSpin) => {
  spin_day = moment().format("YYYY-MM-DD");
  currDateFormat = moment().format();
  const query = `insert into participants (wallet_id, value, spin_no, type, spin_at, spin_day) values(?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    wallet_id,
    value,
    nextSpin.spinNo,
    nextSpin.type,
    currDateFormat,
    spin_day,
  ]);
};
const getParticipants = async (start, end, type, spin) => {
  start = moment(start).startOf("day").format();
  end = moment(end).endOf("day").format();
  const query = `select * from participants where ${
    type === "winners" ? "is_winner = 1 and " : ""
  } spin_day >= '${start}' and spin_day <= '${end}' ${
    spin > 0 ? `and spin_no = ${spin}` : ""
  };`;

  let users = await executeQueryAsync(query);
  return users.map((user) => {
    return {
      id: user.id,
      day: moment(user.spin_day).format("YYYY-MM-DD"),
      spin: user.spin_no,
      wallet_id: formatTransactionId(user.wallet_id),
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

  let users = await executeQueryAsync(query);

  users = groupByDate(users, "spin_day");

  // console.log("users", users);
  const result = [];
  Object.keys(users).forEach((day) => {
    temp_users = users[day];

    users_by_spin = groupBy(temp_users, "spin_no");

    // console.log("users_by_spin", users_by_spin);
    Object.keys(users_by_spin).forEach((spin) => {
      temp_users2 = users_by_spin[spin];
      // console.log("temp_users2", temp_users2[0].wallet_id);
      result.push({
        day,
        spin,
        first: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 1)[0]?.wallet_id
        ),
        second: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 2)[0]?.wallet_id
        ),
        third: formatTransactionId(
          temp_users2.filter((x) => x["winning_rank"] == 3)[0]?.wallet_id
        ),
      });
    });
  });
  // console.log("result", result);
  return result;
};
module.exports = {
  getWinners,
  getParticipants,
  dataExistsForCurrentSpin,
  createParticipant,
  currentSpinData,
  getSpin,
  markAsWinner,
  markWinnerAsPaid,
};
