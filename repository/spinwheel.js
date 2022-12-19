const moment = require("moment");
const {
  formatTransactionId,
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
const getParticipants = async (
  start,
  end,
  resultType,
  spinType,
  spin,
  authenticated
) => {
  start = moment(start).startOf("day").format();
  end = moment(end).endOf("day").format();

  const resultTypeQuery = resultType === "winners" ? "is_winner = 1 and " : "";
  const spinTypeQuery = spinType ? "and type = ? " : "";
  const spinNoQuery = spin > 0 ? `spin_no = ${spin} and ` : "";
  const query = `select * from participants where ${resultTypeQuery} ${spinNoQuery} spin_day >= ? and spin_day <= ? ${spinTypeQuery}`;

  let users = await runQueryAsync(query, [start, end, spinType]);
  return users.map((user) => {
    return {
      day: moment(user.spin_day).format("YYYY-MM-DD"),
      spin: user.spin_no,
      wallet_id: formatTransactionId(user.wallet_id, authenticated),
      rank: user.winning_rank,
      type: user.type,
      win_at: user.is_winner
        ? moment(user.win_at).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
    };
  });
};

const getSpinParticipants = async (day, spinNo, spinType) => {
  spin_day = moment(day).format("YYYY-MM-DD");
  const query = `select * from participants where spin_day = ? and spin_no = ? and type = ?`;

  let users = await runQueryAsync(query, [spin_day, spinNo, spinType]);
  return users.map((user) => {
    return formatTransactionId(user.wallet_id);
  });
};
const getParticipantsOfSpin = async (spin) => {
  const fDate = moment(spin.spin_day).format("YYYY-MM-DD");
  const query =
    "select * from participants where spin_day = ? and spin_no = ? and type = ?;";
  let records = await runQueryAsync(query, [fDate, spin.spin_no, spin.type]);

  participants = records.map((r) => formatTransactionId(r.wallet_id));
  winners = records
    .filter((r) => r.is_winner)
    .sort((a, b) => a.winning_rank - b.winning_rank)
    .map((r) => formatTransactionId(r.wallet_id));
  return [participants, winners];
};

const getWinners = async (from, to, type) => {
  start = moment(from).startOf("day").format();
  end = moment(to).endOf("day").format();
  const query = `select * from participants where is_winner = 1 and spin_day >= ? and spin_day <= ? and type = ?;`;

  let records = await runQueryAsync(query, [from, to, type]);

  return records.map((r) => {
    return {
      day: moment(r.spin_day).format("YYYY-MM-DD"),
      spin: r.spin_no,
      rank: r.winning_rank,
      type: r.type,
      wallet_id: formatTransactionId(r.wallet_id),
      prize: r.prize,
      id: r.id,
    };
  });
};

module.exports = {
  getWinners,
  getParticipants,
  createParticipant,
  markAsWinner,
  markWinnerAsPaid,
  getParticipantsOfSpin,
  getSpinParticipants,
};
