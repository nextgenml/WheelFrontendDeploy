const {
  getTotalEarnings,
  getTodayEarnings,
  getTodayTotal,
  getTodayChoresTotal,
  getOldChoresTotal,
  getTotalByChore,
  getTodayChores,
  getOldChores,
} = require("../repository/chores");

const holderRepo = require("../repository/holder");
const campaignRepo = require("../repository/campaignDetails");
const uuid = require("uuid");
const config = require("../config");

const getSocialSharingStats = async (req, res) => {
  try {
    const { mediaType, walletId } = req.query;

    const [
      total,
      today,
      todayLost,
      todayMax,
      newTotal,
      old,
      like,
      retweet,
      comment,
      follow,
    ] = await Promise.all([
      getTotalEarnings(walletId),
      getTodayEarnings(walletId),
      getTodayTotal(walletId),
      getTodayTotal(walletId),
      getTodayChoresTotal(walletId, mediaType),
      getOldChoresTotal(walletId, mediaType),
      ...["like", "retweet", "comment", "follow"].map((chore) =>
        getTotalByChore(walletId, mediaType, chore)
      ),
    ]);

    res.json({
      total,
      today,
      todayLost,
      todayMax,
      newTotal,
      old,
      like,
      retweet,
      comment,
      follow,
    });
  } catch (ex) {
    logger.error(`error occurred in getTabStats api: ${ex}`);
    res.sendStatus(500);
  }
};

const getChoresByType = async (req, res) => {
  try {
    const { mediaType, walletId, type } = req.query;

    let data = [];
    switch (type) {
      case "new":
        data = await getTodayChores(walletId, mediaType);
        break;
      case "old":
        data = await getOldChores(walletId, mediaType);
        break;
      default:
        data = await getChoresByType(walletId, mediaType, type);
        break;
    }

    res.json({
      data,
    });
  } catch (ex) {
    logger.error(`error occurred in getTabStats api: ${ex}`);
    res.sendStatus(500);
  }
};

const saveCampaign = async (req, res) => {
  try {
    const { body, files } = req;

    const { insertId } = await campaignRepo.saveCampaign(body);

    const holder = await holderRepo.getById(body.wallet_id);
    console.log(
      "wallet_id",
      body.wallet_id,
      holder,
      holder.wallet_balance < config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN
    );
    if (
      !holder ||
      holder.wallet_balance < config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN
    )
      return res.status(400).json({
        statusCode: 400,
        message: `Minimum ${config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN} tokens required to create a campaign`,
      });
    const mediaTypes = (body.media || "").split(",");

    for (const mediaType of mediaTypes) {
      const collection_id = uuid.v4();
      await campaignRepo.saveCampaignDetails({
        ...body,
        campaign_id: insertId,
        content_type: "text",
        collection_id,
        media_type: mediaType,
      });

      if (files && files.length) {
        for (const file of files) {
          await campaignRepo.saveCampaignDetails({
            ...body,
            content: file.path,
            campaign_id: insertId,
            content_type: "image",
            collection_id,
            media_type: mediaType,
          });
        }
      }
    }
    res.json({
      message: "done",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

module.exports = {
  getChoresByType,
  getSocialSharingStats,
  saveCampaign,
};
