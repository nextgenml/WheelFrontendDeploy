const config = require("../config/env");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");

const saveCampaign = async (walletId, data) => {
  const query = `insert into twitter_campaigns (name, content, tweet_link, no_of_users, no_of_levels, level_1_end_date, level_2_end_date, level_3_end_date, level_4_end_date, level_5_end_date, hash_tags, wallet_id, level_1_target, level_2_target, level_3_target, level_4_target, level_5_target, created_at) values(?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ? ,?, now());`;

  return await runQueryAsync(query, [
    data.name,
    data.content,
    data.tweet_link,
    data.no_of_users,
    data.no_of_levels,
    getEndOfDay(data.level_1_end_date),
    getEndOfDay(data.level_2_end_date),
    getEndOfDay(data.level_3_end_date),
    getEndOfDay(data.level_4_end_date),
    getEndOfDay(data.level_5_end_date),
    data.level_1_target,
    data.level_2_target,
    data.level_3_target,
    data.level_4_target,
    data.level_5_target,
    data.hash_tags,
    walletId,
  ]);
};

const updateCampaign = async (id, walletId, data) => {
  const query = `update twitter_campaigns set name = ?, content = ?, tweet_link = ?, no_of_users = ?, no_of_levels = ?, level_1_end_date = ?, level_2_end_date = ?, level_3_end_date = ?, level_4_end_date = ?, level_5_end_date = ?, hash_tags = ?, deleted_at = ?, level_1_target = ?, level_2_target = ?, level_3_target = ?, level_4_target = ?, level_5_target = ? where wallet_id = ? and id = ?;`;

  console.log("data.active", data.active);
  return await runQueryAsync(query, [
    data.name,
    data.content,
    data.tweet_link,
    data.no_of_users,
    data.no_of_levels,
    getEndOfDay(data.level_1_end_date),
    getEndOfDay(data.level_2_end_date),
    getEndOfDay(data.level_3_end_date),
    getEndOfDay(data.level_4_end_date),
    getEndOfDay(data.level_5_end_date),
    data.hash_tags,
    parseInt(data.active) > 0 ? null : moment().format(DATE_TIME_FORMAT),
    data.level_1_target,
    data.level_2_target,
    data.level_3_target,
    data.level_4_target,
    data.level_5_target,
    walletId,
    id,
  ]);
};

const getAllActiveCampaigns = async () => {
  let query = "select * from twitter_campaigns where deleted_at is null";

  return await runQueryAsync(query, []);
};

const getCampaigns = async (walletId, search, pageSize, offset) => {
  let query =
    "select * from twitter_campaigns where (1 = ? or wallet_id = ?) and (1 = ? or name like ?) order by id desc limit ? offset ?;";

  const campaigns = await runQueryAsync(query, [
    config.ADMIN_WALLET === walletId ? 1 : 0,
    walletId,
    search ? 0 : 1,
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

const toggleCampaignState = async (id, walletId, action) => {
  const query = `update twitter_campaigns set deleted_at = ? where wallet_id = ? and id = ?;`;

  return await runQueryAsync(query, [
    action === "delete" ? moment().format(DATE_TIME_FORMAT) : null,
    walletId,
    id,
  ]);
};

const getCampaignById = async (id) => {
  const query = `select * from twitter_campaigns where id = ?;`;

  const results = await runQueryAsync(query, [id]);
  return results[0];
};

const getEndOfDay = (value) =>
  moment(value).startOf("day").format(DATE_TIME_FORMAT);

const getCampaignCompletedChores = async (campaignId) => {
  const query = `select level, count(1) as count from twitter_chores where campaign_id = ? and completed_at is not null group by level;`;
  return await runQueryAsync(query, [campaignId]);
};
module.exports = {
  toggleCampaignState,
  updateCampaign,
  saveCampaign,
  getCampaigns,
  getCampaignById,
  getAllActiveCampaigns,
  getCampaignCompletedChores,
};
