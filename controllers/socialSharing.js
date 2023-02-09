const choresRepo = require("../repository/chores");

const holderRepo = require("../repository/holder");
const campaignRepo = require("../repository/campaignDetails");
const uuid = require("uuid");
const config = require("../config");
const logger = require("../logger");
const { roundTo2Decimals } = require("../utils");

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
      choresRepo.getTotalEarnings(walletId),
      choresRepo.getTodayEarnings(walletId),
      choresRepo.getTodayTotal(walletId),
      choresRepo.getTodayTotal(walletId),
      choresRepo.getTodayChoresTotal(walletId, mediaType),
      choresRepo.getOldChoresTotal(walletId, mediaType),
      ...["like", "retweet", "comment", "follow"].map((chore) =>
        choresRepo.getTotalByChore(walletId, mediaType, chore)
      ),
    ]);

    res.json({
      total: roundTo2Decimals(total),
      today: roundTo2Decimals(today),
      todayLost: roundTo2Decimals(todayLost),
      todayMax: roundTo2Decimals(todayMax),
      newTotal: roundTo2Decimals(newTotal),
      old: roundTo2Decimals(old),
      like: roundTo2Decimals(like),
      retweet: roundTo2Decimals(retweet),
      comment: roundTo2Decimals(comment),
      follow: roundTo2Decimals(follow),
    });
  } catch (ex) {
    logger.error(`error occurred in getSocialSharingStats api: ${ex}`);
    return res.status(400).json({
      statusCode: 400,
      message: ex,
    });
  }
};

const getChoresByType = async (req, res) => {
  try {
    const { mediaType, walletId, type } = req.query;
    let data = [];
    switch (type) {
      case "new":
        data = await choresRepo.getTodayChores(walletId, mediaType);
        break;
      case "old":
        data = await choresRepo.getOldChores(walletId, mediaType);
        break;
      default:
        data = await choresRepo.getChoresByType(walletId, mediaType, type);
        break;
    }

    res.json({
      data,
    });
  } catch (ex) {
    logger.error(`error occurred in getChoresByType api: ${ex}`);
    res.status(400).json({
      statusCode: 400,
      message: ex,
    });
  }
};

const saveCampaign = async (req, res) => {
  try {
    const { body, files } = req;

    const { insertId } = await campaignRepo.saveCampaign(body);

    const holder = await holderRepo.getById(body.wallet_id);

    // if (
    //   !holder ||
    //   holder.wallet_balance < config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN
    // )
    //   return res.status(400).json({
    //     statusCode: 400,
    //     message: `Minimum ${config.MIN_WALLET_BALANCE_TO_CREATE_CAMPAIGN} tokens required to create a campaign`,
    //   });
    const mediaTypes = (body.media || "").split(",");

    for (const mediaType of mediaTypes) {
      const collection_id = uuid.v4();
      await campaignRepo.saveCampaignDetails({
        ...body,
        campaign_id: insertId,
        content_type: "text",
        collection_id,
        media_type: mediaType,
        image_urls: (files || []).map((x) => x.path.split("/")[1]).join(","),
      });
    }
    res.json({
      message: "done",
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const getCampaigns = async (req, res) => {
  const { walletId } = req.query;
  if (!walletId)
    return res.status(400).json({
      statusCode: 400,
      message: "wallet is missing",
    });
  const campaigns = await campaignRepo.getCampaigns(walletId);
  res.json({
    data: campaigns,
  });
};

const getCampaignById = async (req, res) => {
  const { campaignId } = req.query;
  if (!campaignId)
    return res.status(400).json({
      statusCode: 400,
      message: "campaignId is missing",
    });
  const campaign = await campaignRepo.getCampaignById(id);
  res.json({
    data: campaign,
  });
};

const updateCampaign = async (req, res) => {
  const { userAction, walletId, campaignId } = req.query;

  if (!walletId || !campaignId || !userAction)
    return res.status(400).json({
      statusCode: 400,
      message: "required data is missing",
    });

  await campaignRepo.updateCampaign(
    campaignId,
    userAction === "disable" ? 0 : 1
  );
  res.json({
    message: "Updated successfully",
  });
};
module.exports = {
  getChoresByType,
  getSocialSharingStats,
  saveCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
};
