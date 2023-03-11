const { runQueryAsync } = require("../utils/spinwheelUtil");

const getTokens = async () => {
  const query = `select * from tokens`;

  return await runQueryAsync(query, []);
};
const updateBlockNumber = async (id, lastBlockNumber) => {
  const query = `update tokens set last_block_number = ? where id = ?`;

  return await runQueryAsync(query, [lastBlockNumber, id]);
};

module.exports = {
  getTokens,
  updateBlockNumber,
};
