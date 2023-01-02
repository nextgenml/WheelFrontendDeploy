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

const getActiveHolders = async (walletBalance) => {
  const query = `select * from holders where wallet_balance >= ?`;

  return await runQueryAsync(query, [walletBalance]);
};

const getHoldersByWalletId = async (userNames) => {
  const query = `select alias, wallet_id from holders where alias in (?) and is_active = 1`;

  const results = await runQueryAsync(query, [userNames]);

  const result = {};

  results.forEach((r) => {
    result[r.alias] = r.wallet_id;
  });
  return result;
};

module.exports = {
  createHolder,
  getActiveHolders,
  getHoldersByWalletId,
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
