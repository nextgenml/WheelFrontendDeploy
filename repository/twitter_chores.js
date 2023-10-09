const { runQueryAsync } = require("../utils/spinwheelUtil");

const getCampaignStats = async (id) => {
  const query = `select level, count(1) from twitter_chores where id = ? and completed_at is not null group by level;`;

  return await runQueryAsync(query, [id]);
};

const getOtherUserChores = async (campaignId, walletId, level) => {
  const query = `select * from twitter_chores where campaign_id = ? and wallet_id != ? and tweet_link is not null and level = ?`;

  return await runQueryAsync(query, [campaignId, walletId, level]);
};
const isChoreExists = async (walletId, refId) => {
  const query = `select 1 from twitter_chores where wallet_id = ? and ref_id = ?;`;

  const results = await runQueryAsync(query, [walletId, refId]);
  return results.length > 0;
};

const isFirstChoreExists = async (walletId, campaignId) => {
  const query = `select 1 from twitter_chores where wallet_id = ? and level = 1 and campaign_id = ?;`;

  const results = await runQueryAsync(query, [walletId, campaignId]);
  return results.length > 0;
};

const createChore = async (data) => {
  const query = `insert into twitter_chores(wallet_id, ref_id, type, content, source_tweet_link, level, campaign_id, created_at) values(?, ?, ?, ?, ?, ?, ?, now())`;

  return await runQueryAsync(query, [
    data.walletId,
    data.refId,
    data.type,
    data.content,
    data.tweetLink,
    data.level,
    data.campaignId,
  ]);
};

const getMyChores = async (walletId, campaignId, level, pageSize, offset) => {
  let query = `select * from twitter_chores where wallet_id = ? and campaign_id = ? and level = ? order by id desc limit ? offset ?;`;
  const results = await runQueryAsync(query, [
    walletId,
    campaignId,
    level,
    pageSize,
    offset,
  ]);

  query =
    "select * from twitter_chores where wallet_id = ? and campaign_id = ? and level = ?";

  const count = await runQueryAsync(query, [walletId, campaignId, level]);

  return {
    results,
    count: count[0]?.count || 0,
  };
};

const isLinkExists = async (link, id) => {
  const query = `select 1 from twitter_chores where tweet_link = ? and id != ?`;
  const results = await runQueryAsync(query, [link, parseInt(id)]);
  return results.length > 0;
};
const getChoreById = async (id) => {
  const query = `select * from twitter_chores where id = ?`;
  const results = await runQueryAsync(query, [id]);
  return results[0];
};
const updateLink = async (tweetLink, validated, walletId, id) => {
  const query = `update twitter_chores set tweet_link = ?, validated = ?, completed_at = now() where id = ? and wallet_id = ?`;
  return await runQueryAsync(query, [tweetLink, validated, id, walletId]);
};
const getChoreCampaignCompletedStats = async (campaignId, walletId) => {
  const query = `select level, count(1) as count from twitter_chores where campaign_id = ? and wallet_id = ? and completed_at is not null group by level;`;
  return await runQueryAsync(query, [campaignId, walletId]);
};
const getChoreCampaignAssignedStats = async (campaignId, walletId) => {
  console.log("campaignId", campaignId, "walletId", walletId);
  const query = `select level, count(1) as count from twitter_chores where campaign_id = ? and wallet_id = ? group by level;`;
  return await runQueryAsync(query, [campaignId, walletId]);
};
module.exports = {
  updateLink,
  getChoreById,
  isLinkExists,
  createChore,
  getCampaignStats,
  getOtherUserChores,
  isChoreExists,
  isFirstChoreExists,
  getMyChores,
  getChoreCampaignCompletedStats,
  getChoreCampaignAssignedStats,
};
