const choresRepo = require("../../repository/twitter_chores");
const choresManager = require("../../manager/twitter/chores");

const campaignStats = async (req, res) => {
  const { walletId } = req.query;
  const { id } = req.params;

  const results = await choresRepo.campaignStats(campaignId, walletId);
  res.json({
    data: results,
  });
};

const computeChores = async (req, res) => {
  const { walletId } = req.query;
  const { id } = req.params;

  await choresManager.computeChores(walletId, id);
  res.json({
    message: "ok",
  });
};
module.exports = {
  campaignStats,
  computeChores,
};
