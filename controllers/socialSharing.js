const choresRepo = require("../repository/chores");

const campaignRepo = require("../repository/campaignDetails");
const uuid = require("uuid");
const logger = require("../logger");
const { roundTo2Decimals } = require("../utils");
const { createValidationChore } = require("../manager/chores");
require("../manager/jobs/postChores");

const getSocialSharingStats = async (req, res) => {
  try {
    const { mediaType, walletId } = req.query;

    const [
      totalUnpaid,
      totalPaid,
      todayUnpaid,
      todayPaid,
      todayLost,
      todayMax,
      newTotal,
      old,
      like,
      retweet,
      comment,
      follow,
    ] = (
      await Promise.all([
        choresRepo.getTotalEarnings(walletId),
        choresRepo.getTodayEarnings(walletId),
        choresRepo.getTodayLost(walletId),
        choresRepo.getTodayTotal(walletId),
        choresRepo.getTodayChoresTotal(walletId, mediaType),
        choresRepo.getOldChoresTotal(walletId, mediaType),
        ...["like", "retweet", "comment", "follow"].map((chore) =>
          choresRepo.getTotalByChore(walletId, mediaType, chore)
        ),
      ])
    ).flat();

    res.json({
      totalUnpaid: roundTo2Decimals(totalUnpaid),
      totalPaid: roundTo2Decimals(totalPaid),
      todayUnpaid: roundTo2Decimals(todayUnpaid),
      todayPaid: roundTo2Decimals(todayPaid),
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
    const { mediaType, walletId, type, filter } = req.query;
    let data = [];
    switch (type) {
      case "new":
        data = await choresRepo.getTodayChores(walletId, mediaType, filter);
        break;
      case "old":
        data = await choresRepo.getOldChores(walletId, mediaType, filter);
        break;
      default:
        data = await choresRepo.getChoresByType(
          walletId,
          mediaType,
          type,
          filter
        );
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
  let insertId = -1;
  try {
    const { body, files } = req;

    insertId = (await campaignRepo.saveCampaign(body)).insertId;
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
    await campaignRepo.deleteCampaign(insertId);
    return res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const { walletId, search, pageNo, pageSize } = req.query;
    if (!walletId)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet is missing",
      });
    const data = await campaignRepo.getCampaigns(
      walletId,
      search,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    res.json({
      data: data.campaigns,
      total_count: data.count,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 500,
      message: error,
    });
  }
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
  const { userAction, walletId, campaignId, isRecursive } = req.query;
  if (!walletId || !campaignId || !userAction)
    return res.status(400).json({
      statusCode: 400,
      message: "required data is missing",
    });
  await campaignRepo.updateCampaign(
    campaignId,
    userAction === "disable" ? 0 : 1,
    isRecursive
  );
  res.json({
    message: "Updated successfully",
  });
};
const markChoreAsCompletedByUser = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { choreId } = req.params;

    await choresRepo.markChoreAsCompletedByUser(walletId, choreId, req.body);
    createValidationChore(choreId);
    res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    logger.error(`error in markChoreAsCompletedByUser: ${error}`);
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
const validateChore = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { choreId, action } = req.params;
    const { targetChoreId } = req.body;

    await choresRepo.validateChore(walletId, choreId, action, targetChoreId);
    res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    logger.error(`error in validateChore: ${error}`);
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  validateChore,
  getChoresByType,
  getSocialSharingStats,
  saveCampaign,
  getCampaigns,
  getCampaignById,
  markChoreAsCompletedByUser,
  updateCampaign,
};
