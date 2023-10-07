const choresRepo = require("../../repository/twitter_chores");

const campaignStats = async (req, res) => {
  const { walletId } = req.query;
  const { campaignId } = req.params;

  const results = await choresRepo.campaignStats(campaignId, walletId);
  res.json({
    data: results,
  });
};

module.exports = {
  campaignStats,
};
