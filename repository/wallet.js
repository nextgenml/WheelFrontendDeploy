const { runQueryAsync } = require("../utils/spinwheelUtil");

const createWallet = async (walletId, value) => {
  const query = `insert into wallets (wallet_id, value, created_at) values(?, ?, now());`;

  return await runQueryAsync(query, [walletId, value]);
};

const dataExistsForCurrentCycle = async () => {
  const fDate = moment().format("YYYY-MM-DD HH:MM:SS");
  const query = `select 1 from wallets where created_at > ?;`;

  return await runQueryAsync(query, [fDate]);
};

module.exports = {
  createWallet,
  dataExistsForCurrentCycle,
};
