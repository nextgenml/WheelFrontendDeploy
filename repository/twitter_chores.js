const { runQueryAsync } = require("../utils/spinwheelUtil");

const campaignStats = async (id, walletId) => {
  const query = `select level, count(1) from twitter_chores where wallet_id = ? and id = ? and completed_at is not null group by level;`;

  return await runQueryAsync(query, [walletId, id]);
};
module.exports = {
  campaignStats,
};
