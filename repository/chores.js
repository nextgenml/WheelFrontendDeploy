const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const config = require("../config/env");

const getActiveChoresCount = async (campaignId, choreType) => {
  const query =
    "select count(1) as count from chores where campaign_detail_id = ? and chore_type = ? and (is_completed = 1 or valid_to > now())";
  const results = await runQueryAsync(query, [campaignId, choreType]);

  return results[0]?.count || 0;
};

const getCampaignPost = async (campaignId, skippedCampaigns, choreType) => {
  const query = `select * from chores where campaign_detail_id = ? and chore_type = ? and is_completed = 1 and media_post_id is not null and id not in (?) order by rand () limit 1`;

  const results = await runQueryAsync(query, [
    campaignId,
    choreType,
    skippedCampaigns,
  ]);

  return results[0];
};

const nextFollowUsers = async (walletId, mediaType) => {
  const query = `select distinct wallet_id, follow_link from chores 
                  where wallet_id not in 
                  (
                  select distinct follow_user from chores where wallet_id = ? 
                  and chore_type = 'follow' and media_type = ? and follow_user is not null
                  )
                  and chore_type = 'post' and media_type = ? and follow_link is not null
                  and wallet_id != ?;
                `;

  return await runQueryAsync(query, [walletId, mediaType, mediaType, walletId]);
};

const createChore = async (data) => {
  const query = `SET NAMES utf8mb4; insert into chores (campaign_detail_id, wallet_id, media_type, chore_type, valid_from, valid_to, value, ref_chore_id, link_to_post, media_post_id, follow_link, follow_user, comment_suggestions, completed_by_user, content) values(?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.campaignDetailsId,
    data.walletId,
    data.mediaType,
    data.choreType,
    data.validFrom,
    data.validTo,
    data.value,
    data.ref_chore_id || null,
    data.linkToPost || null,
    data.mediaPostId || null,
    data.follow_link || null,
    data.follow_user || null,
    data.commentSuggestions || null,
    0,
    data.content,
  ]);
};
const markOtherChoreAsCompleted = async (data) => {
  // console.log("markOtherChoreAsCompleted", data);

  const query = `update chores set is_completed = 1, link_to_post = ? where wallet_id = ? and campaign_detail_id = ? and valid_to >= ? and chore_type = ? and media_post_id = ?`;

  return await runQueryAsync(query, [
    data.linkToPost,
    data.walletId,
    data.campaignDetailsId,
    moment(data.createdAt).format(DATE_TIME_FORMAT),
    data.choreType,
    data.mediaPostId,
  ]);
};

const markChoreAsCompleted = async (data) => {
  const existsQuery = `select id from chores where wallet_id = ? and campaign_detail_id = ? and valid_to >= ? and chore_type = ?`;

  const existsResults = await runQueryAsync(existsQuery, [
    data.walletId,
    data.campaignDetailsId,
    data.createdAt,
    data.choreType,
  ]);

  if (existsResults.length) {
    const chore = existsResults[0];

    const query = `update chores set is_completed = 1, link_to_post = ?, media_post_id = ?, follow_link = ? where id = ?`;
    return await runQueryAsync(query, [
      data.linkToPost,
      data.mediaPostId,
      data.followLink,
      chore.id,
    ]);
  } else {
    console.log("result not found", data);
  }
};

const markFollowChoreAsCompleted = async (data) => {
  if (!data.walletId || !data.followUser) return;

  const query = `update chores set is_completed = 1 where wallet_id = ? and follow_user = ? and chore_type = 'follow'`;
  return await runQueryAsync(query, [data.walletId, data.followUser]);
};

const getMediaPostIds = async (campaignId) => {
  const query = `select distinct media_post_id from chores where campaign_detail_id = ? and is_completed = 0 and chore_type != 'post' and valid_to >= NOW() - INTERVAL 1 DAY and media_post_id is not null`;

  return await runQueryAsync(query, [campaignId]);
};

const unPaidChores = async () => {
  const query = `select wallet_id, sum(value) as value, GROUP_CONCAT(id) as ids from chores where is_completed = 1 and is_paid != 1 group by wallet_id having value > ?;`;

  return await runQueryAsync(query, [config.MIN_ETH_TO_PAY_IN_GO]);
};

const markChoresAsPaid = async (ids) => {
  const query = `update chores set is_paid = 1 where id in (?);`;

  return await runQueryAsync(query, [ids]);
};

// stats for top bar money stats
const getTotalEarnings = async (walletId) => {
  const query = `select is_paid, sum(value) as sum from chores where is_completed = 1 and wallet_id = ? group by is_paid`;

  const results = await runQueryAsync(query, [walletId]);

  return [
    results.filter((r) => r.is_paid === 0)[0]?.sum || 0,
    results.filter((r) => r.is_paid === 1)[0]?.sum || 0,
  ];
};
const getTodayEarnings = async (walletId) => {
  const query = `select is_paid, sum(value) as sum from chores where is_completed = 1 and valid_from >= ? and wallet_id = ? group by is_paid`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    walletId,
  ]);

  return [
    results.filter((r) => r.is_paid === 0)[0]?.sum || 0,
    results.filter((r) => r.is_paid === 1)[0]?.sum || 0,
  ];
};
const getTodayLost = async (walletId) => {
  const query = `select sum(value) as sum from chores where is_completed = 0 and is_paid = 0 and valid_from >= ? and wallet_id = ?`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    walletId,
  ]);

  return results[0].sum || 0;
};
const getTodayTotal = async (walletId) => {
  const query = `select sum(value) as sum from chores where valid_from >= ? and wallet_id = ?`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    walletId,
  ]);

  return results[0].sum || 0;
};
// stats for left navigation
const getTodayChoresTotal = async (walletId, mediaType) => {
  const query = `select sum(value) as sum, count(1) as count from chores where valid_from >= ? and valid_to >= ? and wallet_id = ? and media_type = ? and is_completed = 0`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    moment().format(DATE_TIME_FORMAT),
    walletId,
    mediaType,
  ]);

  return [results[0].sum || 0, results[0].count || 0];
};
const getOldChoresTotal = async (walletId, mediaType) => {
  const query = `select sum(value) as sum, count(1) as count from chores where valid_from < ? and valid_to >= ? and wallet_id = ? and media_type = ? and is_completed = 0`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    moment().format(DATE_TIME_FORMAT),
    walletId,
    mediaType,
  ]);

  return [results[0].sum || 0, results[0].count || 0];
};

const getTotalByChore = async (walletId, mediaType, choreType) => {
  const query = `select sum(value) as sum, count(1) as count from chores where wallet_id = ? and media_type = ? and chore_type = ? and is_completed = 0 and valid_to >= ?`;

  const results = await runQueryAsync(query, [
    walletId,
    mediaType,
    choreType,
    moment().format(DATE_TIME_FORMAT),
  ]);

  return [results[0].sum || 0, results[0].count || 0];
};

const getTodayChores = async (walletId, mediaType, filter) => {
  const query = `select c.*, cd.image_urls from chores c inner join campaign_details cd on cd.id = c.campaign_detail_id
  where c.valid_from >= ? and c.wallet_id = ? and c.media_type = ? and c.is_completed = 0 and c.valid_to >= ? and cd.is_active = 1 
  and (completed_by_user = ? or 1 = ?) order by c.id desc`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    walletId,
    mediaType,
    moment().format(DATE_TIME_FORMAT),
    filter === "completed" ? 1 : 0,
    filter === "all" ? 1 : 0,
  ]);

  return results;
};
const getOldChores = async (walletId, mediaType, filter) => {
  const query = `select c.*, cd.image_urls from chores c inner join campaign_details cd on cd.id = c.campaign_detail_id
  where c.valid_from < ? and c.valid_to >= ? and c.wallet_id = ? and c.media_type = ? and c.is_completed = 0 and cd.is_active = 1 
  and (completed_by_user = ? or 1 = ?) order by c.id desc;`;

  const results = await runQueryAsync(query, [
    moment().startOf("day").format(DATE_TIME_FORMAT),
    moment().format(DATE_TIME_FORMAT),
    walletId,
    mediaType,
    filter === "completed" ? 1 : 0,
    filter === "all" ? 1 : 0,
  ]);

  return results;
};

const getChoresById = async (choreId) => {
  const query = `select * from chores where id = ?`;

  const results = await runQueryAsync(query, [choreId]);

  return results[0];
};

const getChoresByType = async (walletId, mediaType, choreType, filter) => {
  const query = `select c.*, cd.image_urls from chores c inner join campaign_details cd on cd.id = c.campaign_detail_id
  where c.wallet_id = ? and c.media_type = ? and c.chore_type = ? and c.valid_to >= ? and c.is_completed = 0 and cd.is_active = 1 
  and (completed_by_user = ? or 1 = ?) order by c.id desc;`;

  const results = await runQueryAsync(query, [
    walletId,
    mediaType,
    choreType,
    moment().format(DATE_TIME_FORMAT),
    filter === "completed" ? 1 : 0,
    filter === "all" ? 1 : 0,
  ]);

  return results;
};

const markChoreAsCompletedByUser = async (walletId, choreId, data) => {
  const query = `update chores set completed_by_user = 1, target_post = ?, target_post_link = ?, link_to_post = ? where id  = ? and wallet_id = ?;`;

  return await runQueryAsync(query, [
    data.comment,
    data.commentLink,
    data.postLink,
    choreId,
    walletId,
  ]);
};

const validateChore = async (walletId, choreId, action, targetChoreId) => {
  const query1 = `update chores set is_completed = ? where id  = ?;`;

  await runQueryAsync(query1, [action === "approve" ? 1 : 2, targetChoreId]);

  const query = `update chores set is_completed = 1, completed_by_user = 1  where id  = ? and wallet_id = ?;`;

  return await runQueryAsync(query, [choreId, walletId]);
};

const unValidatedChores = async () => {
  const query = `select * from chores where chore_type = 'validate' and is_completed = 0 and valid_to < now()`;
  return await runQueryAsync(query, []);
};
module.exports = {
  unValidatedChores,
  validateChore,
  markChoreAsCompletedByUser,
  getTodayChores,
  getTotalByChore,
  getOldChores,
  getChoresByType,
  getOldChoresTotal,
  getTodayChoresTotal,
  createChore,
  markChoreAsCompleted,
  getMediaPostIds,
  nextFollowUsers,
  markFollowChoreAsCompleted,
  unPaidChores,
  markChoresAsPaid,
  getTotalEarnings,
  getTodayEarnings,
  getTodayLost,
  getTodayTotal,
  markOtherChoreAsCompleted,
  getActiveChoresCount,
  getCampaignPost,
  getChoresById,
};
