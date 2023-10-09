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
  const query = `select 1 from twitter_chores where wallet_id = ? and campaign_id = ?;`;

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
module.exports = {
  createChore,
  getCampaignStats,
  getOtherUserChores,
  isChoreExists,
  isFirstChoreExists,
};
