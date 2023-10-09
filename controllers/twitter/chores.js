const choresRepo = require("../../repository/twitter_chores");
const choresManager = require("../../manager/twitter/chores");
const { getCampaignById } = require("../../repository/twitter_campaigns");

const updateChore = async (req, res) => {
  try {
    const { id } = req.params;
    const { walletId } = req.query;
    const [isValid, validated, message, error] =
      await choresManager.isValidLink(req.body.tweet_link, id);

    if (!isValid)
      return res.status(400).json({
        message,
        error,
      });

    await choresRepo.updateLink(req.body.tweet_link, validated, walletId, id);
    res.json({
      message: "success",
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
const campaignStats = async (req, res) => {
  const { id } = req.params;

  const results = await choresRepo.getCampaignStats(id);
  res.json({
    data: results,
  });
};

const userCampaignStats = async (req, res) => {
  const { id } = req.params;
  const { walletId } = req.query;

  const results = await choresManager.getUserCampaignStats(id, walletId);
  res.json({
    data: results,
  });
};

const computeChores = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { id } = req.params;

    await choresManager.computeChores(walletId, id);
    res.json({
      message: "ok",
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getChores = async (req, res) => {
  try {
    const { walletId, pageNo, pageSize } = req.query;
    const { id, levelId } = req.params;
    const data = await choresRepo.getMyChores(
      walletId,
      id,
      levelId,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    res.json({
      data: data.results,
      total_count: data.count,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  campaignStats,
  computeChores,
  getChores,
  updateChore,
  userCampaignStats,
};
