const { runQueryAsync } = require("../utils/spinwheelUtil");
const {
  uniqueNamesGenerator,
  names,
  starWars,
} = require("unique-names-generator");

const createHolder = async (walletId, walletBalance) => {
  const existsQuery = `select 1 from holders where wallet_id = ?`;

  const existsResults = await runQueryAsync(existsQuery, [walletId]);

  if (!existsResults.length) {
    const query = `insert into holders (wallet_id, wallet_balance, alias, is_active) values(?, ?, ?, true);`;
    const randomName = await getUniqueName(walletId);

    return await runQueryAsync(query, [walletId, walletBalance, randomName]);
  }
};

const getUniqueName = async (walletId) => {
  while (1) {
    const existsQuery = `select 1 from holders where alias = ?`;
    const randomName = `${uniqueNamesGenerator({
      dictionaries: [names, starWars],
    })}_${walletId.substring(walletId.length - 4)}`;

    const existsResults = await runQueryAsync(existsQuery, [randomName]);

    // console.log("randomName", randomName);
    if (!existsResults.length) return randomName;
  }
};
// createHolder("alskdjflasf", 12411);
module.exports = {
  createHolder,
};
