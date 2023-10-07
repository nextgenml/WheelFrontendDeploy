const config = require("../config/env");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");

const saveCampaign = async (walletId, data) => {
  const query = `insert into twitter_campaigns (name, end_date, content, tweet_link, no_of_users, no_of_levels, wallet_id, created_at) values(?, ?, ?, ?, ?, ? ,?, now());`;

  return await runQueryAsync(query, [
    data.name,
    moment(data.end_date).startOf("day").format(DATE_TIME_FORMAT),
    data.content,
    data.tweet_link,
    data.no_of_users,
    data.no_of_levels,
    walletId,
  ]);
};

const getCampaigns = async (walletId, search, pageSize, offset) => {
  let query =
    "select * from twitter_campaigns where (1 = ? or wallet_id = ?) and (1 = ? or name like ?) order by id desc limit ? offset ?;";

  const campaigns = await runQueryAsync(query, [
    config.ADMIN_WALLET === walletId ? 1 : 0,
    walletId,
    search ? 0 : 1,
    `%${search}%`,
    `%${search}%`,
    pageSize,
    offset,
  ]);

  query =
    "select count(1) as count from twitter_campaigns where (1 = ? or wallet_id = ?) and (1 = ? or name like ?);";

  const count = await runQueryAsync(query, [
    config.ADMIN_WALLET === walletId ? 1 : 0,
    walletId,
    search ? 0 : 1,
    `%${search}%`,
    `%${search}%`,
  ]);

  return {
    campaigns,
    count: count[0].count,
  };
};

const updateCampaign = async (id, walletId, data) => {
  const query = `update twitter_campaigns set name = ?, end_date = ?, content = ?, tweet_link = ?, no_of_users = ?, no_of_levels = ? where wallet_id = ? and id = ?;`;

  return await runQueryAsync(query, [
    data.name,
    moment(data.end_date).startOf("day").format(DATE_TIME_FORMAT),
    data.content,
    data.tweet_link,
    data.no_of_users,
    data.no_of_levels,
    walletId,
    id,
  ]);
};

const toggleCampaignState = async (id, walletId, action) => {
  const query = `update twitter_campaigns set deleted_at = ? where wallet_id = ? and id = ?;`;

  return await runQueryAsync(query, [
    action === "delete" ? moment().format(DATE_TIME_FORMAT) : null,
    walletId,
    id,
  ]);
};

const getCampaignById = async (id, walletId) => {
  const query = `select * from twitter_campaigns where wallet_id = ? and id = ?;`;

  const results = await runQueryAsync(query, [walletId, id]);
  return results[0];
};

module.exports = {
  toggleCampaignState,
  updateCampaign,
  saveCampaign,
  getCampaigns,
  getCampaignById,
};
