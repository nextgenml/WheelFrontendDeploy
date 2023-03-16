const { runQueryAsync } = require("../utils/spinwheelUtil");

const getTokens = async () => {
  const query = `select * from tokens`;

  return await runQueryAsync(query, []);
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
};
