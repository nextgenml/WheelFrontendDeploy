const { runQueryAsync } = require("../utils/spinwheelUtil");

const updateLastRunAt = async (id, lastRunAt) => {
  const query = `update tokens set last_run_at = ? where id = ?`;

  return await runQueryAsync(query, [lastRunAt, id]);
};
const getTokens = async () => {
  const query = `select * from tokens`;

  return await runQueryAsync(query, []);
};

const getTokenStats = async (token) => {
  const query = `select sum(${token}_balance) as balance, count(1) as holdersCount from holders where ${token}_balance > 0`;

  const results = await runQueryAsync(query, []);
  return results[0];
};
const updateBlockNumber = async (id, lastBlockNumber) => {
  const query = `update tokens set last_block_number = ? where id = ?`;

  return await runQueryAsync(query, [lastBlockNumber, id]);
};
const walletBalanceByToken = async (walletId) => {
  const query =
    "select volt_balance, floki_balance, elon_balance, shib_balance from holders where wallet_id = ?";
  return await runQueryAsync(query, [walletId]);
};
const totalBalanceByToken = async () => {
  const query =
    "select sum(volt_balance) as volt_balance, sum(floki_balance) as floki_balance, sum(elon_balance) as elon_balance, sum(shib_balance) as shib_balance from holders";
  return await runQueryAsync(query, []);
};
module.exports = {
  getTokens,
  updateBlockNumber,
  totalBalanceByToken,
  walletBalanceByToken,
  getTokenStats,
  updateLastRunAt,
};
