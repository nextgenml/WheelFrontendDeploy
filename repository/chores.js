const { runQueryAsync } = require("../utils/spinwheelUtil");

const getPreviousCampaignIds = async (walletId) => {
  const query = `select distinct campaign_detail_id from chores where wallet_id = ? and chore_type = 'post'`;

  const results = await runQueryAsync(query, [walletId]);

  return results.map((r) => r.campaign_detail_id);
};

const getPrevOtherUserPostIds = async (walletId) => {
  const query = `select distinct ref_chore_id from chores where wallet_id = ? and chore_type != 'post'`;

  const results = await runQueryAsync(query, [walletId]);

  return results.map((r) => r.ref_chore_id);
};

const otherUserPosts = async (prevIds) => {
  const query = `select c.* from chores c
                inner join campaign_details cd on c.campaign_detail_id = cd.id 
                where cd.start_time <= now() and cd.end_time >= now() 
                and cd.is_active = 1 and cd.content_type = 'text' and c.id not in (?)`;

  return await runQueryAsync(query, [prevIds]);
};

const createChore = async (data) => {
  const query = `insert into chores (campaign_detail_id, wallet_id, media_type, chore_type, valid_from, valid_to, value) values(?, ?, ?, ?, ?, ? ,?);`;

  return await runQueryAsync(query, [
    data.campaignDetailsId,
    data.walletId,
    data.mediaType,
    data.choreType,
    data.validFrom,
    data.validTo,
    data.value,
  ]);
};

const markChoreAsCompleted = async (data) => {
  if (!data.walletId) return;
  // console.log("markChoreAsCompleted", data);

  const existsQuery = `select id from chores where wallet_id = ? and campaign_detail_id = ? and valid_to >= ?`;

  const existsResults = await runQueryAsync(existsQuery, [
    data.walletId,
    data.campaignDetailsId,
    data.createdAt,
  ]);

  if (existsResults.length) {
    const chore = existsResults[0];

    const query = `update chores set is_completed = 1, link_to_post = ?, media_post_id = ? where id = ?`;

    return await runQueryAsync(query, [
      data.linkToPost,
      data.mediaPostId,
      chore.id,
    ]);
  }
};

module.exports = {
  getPreviousCampaignIds,
  createChore,
  markChoreAsCompleted,
  getPrevOtherUserPostIds,
  otherUserPosts,
};
