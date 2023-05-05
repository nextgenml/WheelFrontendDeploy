const choresRepo = require("../repository/chores");

const campaignRepo = require("../repository/campaignDetails");
const campaign1Repo = require("../repository/campaign");
const uuid = require("uuid");
const logger = require("../logger");
const { roundTo2Decimals } = require("../utils");
const {
  createValidationChore,
  createCompletedPostChore,
  dashboardStats,
} = require("../manager/chores");
const { createOtherChores } = require("../manager/jobs/otherChores");
require("../manager/jobs/postChores");
require("../manager/jobs/validationChore");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const config = require("../config/env");
const getSocialSharingStats = async (req, res) => {
  try {
    let { mediaType, walletId, viewAs } = req.query;

    walletId = viewAs && config.ADMIN_WALLET === walletId ? viewAs : walletId;
    const stats = await dashboardStats(mediaType, walletId);

    res.json(stats);
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
    let { mediaType, walletId, type, filter, pageNo, pageSize, viewAs } =
      req.query;
    const offset = pageNo * pageSize;
    pageSize = parseInt(pageSize);
    walletId = viewAs && config.ADMIN_WALLET === walletId ? viewAs : walletId;

    let data = [];
    switch (type) {
      case "new":
        data = await choresRepo.getTodayChores(
          walletId,
          mediaType,
          filter,
          offset,
          pageSize
        );
        break;
      case "old":
        data = await choresRepo.getOldChores(
          walletId,
          mediaType,
          filter,
          offset,
          pageSize
        );
        break;
      default:
        data = await choresRepo.getChoresByType(
          walletId,
          mediaType,
          type,
          filter,
          offset,
          pageSize
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
    const { walletId } = req.query;
    insertId = (
      await campaignRepo.saveCampaign({ ...body, wallet_id: walletId })
    ).insertId;
    const mediaType = (body.media || "").split(",")[0];

    const collection_id = uuid.v4();
    const details = await campaignRepo.saveCampaignDetails({
      ...body,
      campaign_id: insertId,
      content_type: "text",
      collection_id,
      media_type: mediaType,
      image_urls: (files || []).map((x) => x.path.split("/")[1]).join(","),
    });
    if (body.post_link) {
      await createCompletedPostChore(
        details[1].insertId,
        walletId,
        moment(body.start_time).format(DATE_TIME_FORMAT),
        moment(body.end_time).format(DATE_TIME_FORMAT),
        body.content,
        body.post_link
      );
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
    const chore = await choresRepo.getChoresById(choreId);

    await choresRepo.validateChore(
      walletId,
      choreId,
      action,
      chore.ref_chore_id
    );

    const campaign = await campaign1Repo.getCampaignForChore(choreId);
    if (action === "approve") {
      if (campaign.is_recursive_algo)
        createOtherChores(
          [
            {
              ...campaign,
              content: chore.content,
            },
          ],
          "comment",
          {
            mediaPostId: chore.media_post_id,
            content: chore.content,
            postLink: chore.link_to_post,
          }
        );
    }
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
