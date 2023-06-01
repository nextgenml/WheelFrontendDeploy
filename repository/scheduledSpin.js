const { executeQueryAsync, runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

const getSpins = async (offset, pageSize) => {
  const query =
    "select * from scheduled_spins order by id desc limit ? offset ?";
  const data = await runQueryAsync(query, [pageSize, offset]);
  const countQ = "select count(1) as count from scheduled_spins";
  const count = await runQueryAsync(countQ, []);
  return [data, count[0].count];
};
const createSpin = async (data) => {
  const query = `insert into scheduled_spins(type, is_active, run_at, spin_day, min_wallet_amount, no_of_winners, spin_delay, winner_prizes, participants, currency, is_diamond) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const winnerPrizes = (data.winner_prizes || "")
    .split(",")
    .map((x) => x.trim());
  await runQueryAsync(query, [
    data.type,
    data.is_active || 0,
    data.run_at,
    data.spin_day,
    data.min_wallet_amount,
    winnerPrizes.length,
    20,
    winnerPrizes.join(","),
    data.participants,
    data.currency,
    data.is_diamond,
  ]);
};

const updateSpin = async (data) => {
  const query = `update scheduled_spins set type = ?, is_active = ?, run_at = ?, spin_day = ?, min_wallet_amount = ?, no_of_winners = ?, spin_delay = ?, winner_prizes = ?, participants = ?, currency = ?, is_diamond = ?, updated_at = ? where id = ?`;
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
    data.is_diamond,
    moment().format(DATE_TIME_FORMAT),
    data.id,
  ]);
};
const recentUpdatedAt = async () => {
  const query = `select max(updated_at) as updated_at from scheduled_spins`;
  const results = await runQueryAsync(query, []);
  return moment(results[0].updated_at).format(DATE_TIME_FORMAT);
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
  recentUpdatedAt,
};
