const { runQueryAsync } = require("../utils/spinwheelUtil");
const {
  uniqueNamesGenerator,
  names,
  starWars,
} = require("unique-names-generator");

const createHolder = async (walletId, walletBalance) => {
  const existsQuery = `select id from holders where wallet_id = ?`;

  const existsResults = await runQueryAsync(existsQuery, [walletId]);

  if (!existsResults.length) {
    const query = `insert into holders (wallet_id, wallet_balance, alias, is_active) values(?, ?, ?, true);`;
    const randomName = await getUniqueName(walletId);

    return await runQueryAsync(query, [walletId, walletBalance, randomName]);
  } else {
    const query = `update holders set wallet_balance = ? where id = ?`;

    return await runQueryAsync(query, [walletBalance, existsResults[0].id]);
  }
};

const getActiveHolders = async (walletBalance) => {
  const query = `select * from holders where wallet_balance >= ? and is_active = 1`;

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

const updateMediaIds = async (users) => {
  for (const user of users) {
    const records = await runQueryAsync(
      `select * from holders where alias = ? limit 1;`,
      [user.username]
    );
    const holder = records[0];
    if (holder && holder.twitter_id != user.userId) {
      await runQueryAsync(`update holders set twitter_id =  ? where id = ?;`, [
        user.userId,
        holder.id,
      ]);
    }
  }
};

const getById = async (wallet_id) => {
  const query = `select * from holders where wallet_id = ?;`;

  const results = await runQueryAsync(query, [wallet_id]);
  return results[0];
};

const updateAlias = async (wallet_id, newAlias) => {
  const query = `update holders set alias = ? where wallet_id = ?;`;

  return await runQueryAsync(query, [newAlias, wallet_id]);
};

const aliasExists = async (wallet_id, alias) => {
  const query = `select * from holders where wallet_id != ? and alias = ?;`;

  const results = await runQueryAsync(query, [wallet_id, alias]);
  return !!results[0];
};

module.exports = {
  getById,
  createHolder,
  getActiveHolders,
  getHoldersByWalletId,
  updateMediaIds,
  updateAlias,
  aliasExists,
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
