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
    "select token, sum(value) as value from wallets where wallet_id = ? group by token";
  return await runQueryAsync(query, [walletId]);
};
const totalBalanceByToken = async () => {
  const query = "select token, sum(value) as value from wallets group by token";
  return await runQueryAsync(query, []);
};
module.exports = {
  getTokens,
  updateBlockNumber,
  totalBalanceByToken,
  walletBalanceByToken,
};
