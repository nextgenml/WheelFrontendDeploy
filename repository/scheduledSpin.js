const { executeQueryAsync, runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

const getSpins = async (offset, pageSize) => {
  const query = "select * from scheduled_spins limit ? offset ?";
  const data = await runQueryAsync(query, [pageSize, offset]);
  const countQ = "select count(1) as count from scheduled_spins";
  const count = await runQueryAsync(countQ, []);
  return [data, count[0].count];
};
const createSpin = async (data) => {
  const query = `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes, participants, currency) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const winnerPrizes = (data.winner_prizes || "")
    .split(",")
    .map((x) => x.trim());
  await runQueryAsync(query, [
    data.type,
    data.is_active,
    data.run_at,
    data.spin_day,
    data.min_wallet_amount,
    winnerPrizes.length,
    20,
    winnerPrizes.join(","),
    data.participants,
    data.currency,
  ]);
};

const updateSpin = async (data) => {
  const query = `update scheduled_spins set type = ?, is_active = ?, run_at = ?, spin_day = ?, min_wallet_amount = ?, no_of_winners = ?, spin_delay = ?, winner_prizes = ?, participants = ?, currency = ? where id = ?`;
  const winnerPrizes = (data.winner_prizes || "")
    .split(",")
    .map((x) => x.trim());
  await runQueryAsync(query, [
    data.type,
    data.is_active,
    data.run_at,
    data.spin_day,
    data.min_wallet_amount,
    winnerPrizes.length,
    20,
    winnerPrizes.join(","),
    data.participants,
    data.currency,
    data.id,
  ]);
};
const getSpinById = async (id) => {
  const query = "select * from scheduled_spins where id = ?;";
  const results = await runQueryAsync(query, [id]);
  return results[0];
};

const updateLaunchDate = async (id) => {
  const dateFormatted = moment().format(DATE_TIME_FORMAT);
  const query = "update scheduled_spins set prev_launch_date = ? where id = ?;";
  return await runQueryAsync(query, [dateFormatted, id]);
};

const recentDailyLaunchAt = async () => {
  const query =
    "select * from scheduled_spins where type = 'daily' order by prev_launch_date desc limit 1;";
  const records = await executeQueryAsync(query);
  return records[0]?.prev_launch_date;
};

const getScheduledSpin = async (id) => {
  const query = "select * from scheduled_spins where id = ?;";
  const spins = await runQueryAsync(query, [id]);
  return spins[0];
};
module.exports = {
  getAllSpins,
  updateLaunchDate,
  recentDailyLaunchAt,
  getScheduledSpin,
  getSpinById,
  getSpins,
  createSpin,
  updateSpin,
};
