const { runQueryAsync } = require("../utils/spinwheelUtil");
const { uniqueNamesGenerator, names } = require("unique-names-generator");
const config = require("../config/env");
const uuid = require("uuid");
const moment = require("moment");

const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { dbConnection } = require("../dbconnect");
// Created during tokens pulling implementation
const createHolderV1 = async (walletId) => {
  const existsQuery = `select id from holders where wallet_id = ?`;

  const existsResults = await runQueryAsync(existsQuery, [walletId]);

  if (!existsResults.length) {
    const query = `insert into holders (wallet_id, alias, is_active, created_at) values(?, ?, true, now());`;
    const randomName = ""; // await getUniqueName(walletId);

    return await runQueryAsync(query, [walletId, randomName]);
  }
};

const createNMLHolderV1 = async (walletId) => {
  const existsQuery = `select id from nml_holders where wallet_id = ?`;

  const existsResults = await runQueryAsync(existsQuery, [walletId]);

  if (!existsResults.length) {
    const query = `insert into nml_holders (wallet_id) values(?);`;

    return await runQueryAsync(query, [walletId]);
  }
};

const getNMLHolders = async () => {
  const query = `select wallet_id from nml_holders where balance > 0`;

  return await runQueryAsync(query, []);
};
const getHoldersMeta = async () => {
  const query = `select max(id) as max_id, min(id) as min_id from holders`;

  const results = await runQueryAsync(query, []);
  return results[0];
};

const getHolderByPage = async (minId, maxId) => {
  const query = `select wallet_id from holders where id >= ? and id < ?`;
  return await runQueryAsync(query, [minId, maxId]);
};
const updateHolderBalance = async (walletId, balance, token) => {
  const query = `update holders set ${token}_balance = ? where wallet_id = ?`;
  return await runQueryAsync(query, [balance, walletId]);
};

const updateNMLBalance = async (walletId, balance) => {
  const query = `update nml_holders set balance = ? where wallet_id = ?`;
  return await runQueryAsync(query, [balance, walletId]);
};

const updateHolderDiamondStatus = async (walletId, status) => {
  const query = `update holders set is_diamond = ? where wallet_id = ?`;
  return await runQueryAsync(query, [status, walletId]);
};
const updateNMLHolderDiamondStatus = async (walletId, status) => {
  const query = `update nml_holders set is_diamond = ? where wallet_id = ?`;
  return await runQueryAsync(query, [status, walletId]);
};

const nextUserForPost = async (campaignId, skippedUsers) => {
  const query = `select distinct h.wallet_id from holders h left join chores c on c.wallet_id = h.wallet_id 
    and c.campaign_detail_id = ? and c.chore_type = 'post'
    where c.id is null and h.twitter_link is not null and h.is_active = 1 
    and h.wallet_id not in (?)
    ORDER BY RAND () limit 1`;

  const results = await runQueryAsync(query, [campaignId, skippedUsers]);
  return results[0];
};

const getNextUserForChore = async (choreId, choreType, skippedUsers) => {
  const query = `select distinct h.wallet_id from holders h left join chores c on c.wallet_id = h.wallet_id and c.ref_chore_id = ? and c.chore_type = ? where c.id is null and h.twitter_link is not null and h.wallet_id not in (?) ORDER BY RAND () limit 1`;

  const results = await runQueryAsync(query, [
    choreId,
    choreType,
    skippedUsers,
  ]);

  return results[0];
};

const choreAlreadyExists = async (walletId, choreType, refChoreId) => {
  const query =
    "select 1 from chores where chore_type = ? and wallet_id = ? and ref_chore_id = ?";
  const results = await runQueryAsync(query, [choreType, walletId, refChoreId]);
  return results.length > 0;
};
const isEligibleForChore = async (walletId, choreType) => {
  const query =
    "select count(1) as count from chores where chore_type = ? and wallet_id = ? and valid_from >= DATE_SUB(NOW(), INTERVAL 2 HOUR)";
  const results = await runQueryAsync(query, [choreType, walletId]);
  return (results[0]?.count || 0) < config.NO_OF_POSTS_PER_DAY;
};

const createHolder = async (walletId, walletBalance) => {
  const existsQuery = `select id from holders where wallet_id = ?`;

  const existsResults = await runQueryAsync(existsQuery, [walletId]);

  if (!existsResults.length) {
    const query = `insert into holders (wallet_id, wallet_balance, alias, is_active, created_at) values(?, ?, ?, true, now());`;
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

const getActiveMediaHolders = async () => {
  const query = `select * from holders where twitter_link is not null;`;

  return await runQueryAsync(query, []);
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

const getHolders = async (offset, pageSize, search, fromDate, toDate) => {
  console.log("fromDate, toDate", fromDate, toDate);

  // const start = moment(fromDate).format(DATE_TIME_FORMAT);
  // const end = moment(toDate).format(DATE_TIME_FORMAT);
  const query = `select h.wallet_id from holders h inner join chores c on c.wallet_id = h.wallet_id
  where (1 = ? or h.wallet_id = ?) and c.mark_as_done_at is not null and c.mark_as_done_at >= ? and c.mark_as_done_at <= ? group by h.wallet_id having count(1) > 0
   limit ? offset ?;`;

  console.log(
    "running query",
    dbConnection.format(query, [
      search ? 0 : 1,
      search,
      fromDate,
      toDate,
      pageSize,
      offset,
    ])
  );
  const results = await runQueryAsync(query, [
    search ? 0 : 1,
    search,
    fromDate,
    toDate,
    pageSize,
    offset,
  ]);
  console.log("results query");
  const query1 = `select count(distinct h.wallet_id) as count from holders h inner join chores c on c.wallet_id = h.wallet_id
  where (1 = ? or h.wallet_id = ?) and c.mark_as_done_at is not null and c.mark_as_done_at >= ? and c.mark_as_done_at <= ?;`;

  const results1 = await runQueryAsync(query1, [
    search ? 0 : 1,
    search,
    fromDate,
    toDate,
  ]);
  return [results, results1[0].count];
};

const getByInviteCode = async (code) => {
  const query = `select * from holders where invite_code = ?;`;

  const results = await runQueryAsync(query, [code]);
  return results[0];
};
const getByTwitter = async (twitter) => {
  const query = `select * from holders where twitter_link = ?;`;

  const results = await runQueryAsync(query, [twitter]);
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

const getUniqueName = async (walletId) => {
  while (1) {
    const existsQuery = `select 1 from holders where alias = ?`;
    const randomName = `${uniqueNamesGenerator({
      dictionaries: [names],
    })}${walletId.substring(walletId.length - 2)}`;

    const existsResults = await runQueryAsync(existsQuery, [randomName]);

    if (!existsResults.length) return randomName;
  }
};

const saveHolderByAdmin = async (data) => {
  const query = `update holders set minimum_balance_for_ai = ?, is_banned = ? where wallet_id = ?`;
  return await runQueryAsync(query, [
    data.minimum_balance_for_ai,
    data.is_banned,
    data.wallet_id,
  ]);
};
const saveSocialLinks = async (
  walletId,
  facebookLink,
  mediumLink,
  linkedinLink,
  twitterLink,
  telegramLink
) => {
  const existsQuery = "select 1 from holders where wallet_id = ?";
  const results = await runQueryAsync(existsQuery, [walletId]);
  if (results.length) {
    const query = `update holders set facebook_link = ?, medium_link = ?, linkedin_link = ?, twitter_link = ?, telegram_link = ?, social_links_updated_at = now()  where wallet_id = ?`;
    return await runQueryAsync(query, [
      facebookLink,
      mediumLink,
      linkedinLink,
      twitterLink,
      telegramLink,
      walletId,
    ]);
  } else {
    const query = `insert into holders(wallet_id, alias, facebook_link, medium_link, linkedin_link, twitter_link, telegram_link, is_active, social_links_updated_at, created_at) values(?, ?, ?, ?, ?, ?, ?, ?, now(), now())`;
    const randomName = await getUniqueName(walletId);

    return await runQueryAsync(query, [
      walletId,
      randomName,
      facebookLink,
      mediumLink,
      linkedinLink,
      twitterLink,
      telegramLink,
      1,
    ]);
  }
};

const getInviteCode = async (walletId) => {
  const query = `select * from holders where wallet_id = ? limit 1`;
  const results = await runQueryAsync(query, [walletId]);
  const holder = results[0];
  if (holder) {
    if (holder.invite_code) return holder.invite_code;

    const query2 = `update holders set invite_code = ? where id = ?`;
    const inviteCode = uuid.v4();
    await runQueryAsync(query2, [inviteCode, holder.id]);
    return inviteCode;
  } else {
    const query = `insert into holders(wallet_id, alias, invite_code, is_active, created_at) values(?, ?, ?, ?, now())`;
    const randomName = await getUniqueName(walletId);
    const inviteCode = uuid.v4();
    await runQueryAsync(query, [walletId, randomName, inviteCode, 1]);

    return inviteCode;
  }
};
const updateJoinedInviteCode = async (id, inviteCode) => {
  const query = `update holders set joined_invite_code = ? where id = ?`;
  return await runQueryAsync(query, [inviteCode, id]);
};

const getTopTokenHolders = async (token, winners) => {
  const query = `select wallet_id from holders order by ${token}_balance desc limit ?;`;

  const results = await runQueryAsync(query, [parseInt(winners)]);
  return results;
};

module.exports = {
  getTopTokenHolders,
  updateJoinedInviteCode,
  getInviteCode,
  getById,
  createHolder,
  getActiveHolders,
  getHoldersByWalletId,
  updateMediaIds,
  updateAlias,
  aliasExists,
  nextUserForPost,
  isEligibleForChore,
  getNextUserForChore,
  getActiveMediaHolders,
  createHolderV1,
  getHoldersMeta,
  getHolderByPage,
  updateHolderBalance,
  saveSocialLinks,
  getByTwitter,
  getByInviteCode,
  saveHolderByAdmin,
  choreAlreadyExists,
  getHolders,
  getNMLHolders,
  updateHolderDiamondStatus,
  createNMLHolderV1,
  updateNMLBalance,
  updateNMLHolderDiamondStatus,
};
