const { runQueryAsync } = require("../utils/spinwheelUtil");

const createChatgptLog = async (walletId, prompt) => {
  const query = `insert into chatgpt_log (wallet_id, query, created_at) values(?, ?, now());`;
  return await runQueryAsync(query, [walletId, prompt]);
};

module.exports = {
  createChatgptLog,
};
