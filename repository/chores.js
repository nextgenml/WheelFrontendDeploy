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
                and cd.is_active = 1 and cd.content_type = 'text' and c.chore_type = 'post' 
                and c.id not in (?) and c.media_post_id is not null`;

  return await runQueryAsync(query, [prevIds]);
};

const nextFollowUsers = async (walletId, mediaType) => {
  const query = `select distinct wallet_id, follow_link from chores 
                  where wallet_id not in 
                  (
                  select distinct follow_user from chores where wallet_id = ? 
                  and chore_type = 'follow' and media_type = ? and follow_user is not null
                  )
                  and chore_type = 'post' and media_type = ? 
                  and wallet_id != ?;
                `;

  return await runQueryAsync(query, [walletId, mediaType, mediaType, walletId]);
};

const createChore = async (data) => {
  const query = `insert into chores (campaign_detail_id, wallet_id, media_type, chore_type, valid_from, valid_to, value, ref_chore_id, link_to_post, media_post_id, follow_link, follow_user) values(?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?);`;

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
  ]);
};

const markChoreAsCompleted = async (data) => {
  if (!data.walletId) return;
  console.log("markChoreAsCompleted", data);

  const existsQuery = `select id from chores where wallet_id = ? and campaign_detail_id = ? and valid_to >= ? and chore_type = ?`;

  const existsResults = await runQueryAsync(existsQuery, [
    data.walletId,
    data.campaignDetailsId,
    data.createdAt,
    data.choreType,
  ]);

  if (existsResults.length) {
    const chore = existsResults[0];

    if (chore.chore_type === "post") {
      const query = `update chores set is_completed = 1, link_to_post = ?, media_post_id = ?, follow_link = ? where id = ?`;
      return await runQueryAsync(query, [
        data.linkToPost,
        data.mediaPostId,
        data.followLink,
        chore.id,
      ]);
    } else {
      const query = `update chores set is_completed = 1 where id = ?`;

      return await runQueryAsync(query, [chore.id]);
    }
  }
};

const markFollowChoreAsCompleted = async (data) => {
  if (!data.walletId || !data.followUser) return;
  console.log("markChoreAsCompleted", data);

  const query = `update chores set is_completed = 1 where wallet_id = ? and follow_user = ? and chore_type = 'follow'`;
  return await runQueryAsync(query, [data.walletId, data.followUser]);
};

const getMediaPostIds = async (campaignId) => {
  const query = `select distinct media_post_id from chores where campaign_detail_id = ? and is_completed = 0 and chore_type != 'post' and valid_to >= NOW() - INTERVAL 1 DAY`;

  return await runQueryAsync(query, [campaignId]);
};

module.exports = {
  getPreviousCampaignIds,
  createChore,
  markChoreAsCompleted,
  getPrevOtherUserPostIds,
  otherUserPosts,
  getMediaPostIds,
  nextFollowUsers,
  markFollowChoreAsCompleted,
};
