const { runQueryAsync } = require("../utils/spinwheelUtil");

const getPreviousCampaignIds = async (walletId) => {
  const query = `select campaign_detail_id from chores where wallet_id = ? and chore_type = 'post'`;

  const results = await runQueryAsync(query, [walletId]);

  return results.map((r) => r.campaign_detail_id);
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

module.exports = {
  getPreviousCampaignIds,
  createChore,
};
