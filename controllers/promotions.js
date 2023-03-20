const config = require("../config/env");
const logger = require("../logger");
const promotionsRepo = require("../repository/promotions");

const updateBlogCount = async (req, res) => {
  try {
    if (!req.body.walletId)
      return res.status(400).json({
        statusCode: 400,
        message: "Unauthorized",
      });
    await promotionsRepo.updateBlogCount(req.body.walletId);
    return res.status(200).json({
      message: "done",
    });
  } catch (error) {}
};
const savePromotionRequest = async (req, res) => {
  try {
    if (
      !req.body.payer_wallet_id ||
      !req.body.receiver_wallet_id ||
      !req.body.blogs_limit ||
      !req.body.eth_amount ||
      !req.body.overall_promotions_limit
    )
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient data sent to server",
      });

    await promotionsRepo.savePromotion(req.body);
    return res.status(200).json({
      message: "Saved successfully",
    });
  } catch (error) {
    console.log("error", error);
    logger.error(`error occurred in savePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
const approvePromotionRequest = async (req, res) => {
  try {
    if (!req.body.requestId || !req.body.status)
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient data",
      });

    if (req.body.walletId !== config.ADMIN_WALLET_1)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    await promotionsRepo.updatePromotionAdmin(req.body);
    return res.status(200).json({
      message: "Saved successfully",
    });
  } catch (error) {
    logger.error(`error occurred in approvePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
const markAsDoneByUser = async (req, res) => {
  try {
    if (!req.body.requestId || !req.body.walletId)
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient data",
      });

    await promotionsRepo.updatePromotion(
      req.body.requestId,
      req.body.walletId,
      req.body.paid
    );
    return res.status(200).json({
      message: "Saved successfully",
    });
  } catch (error) {
    logger.error(`error occurred in markAsDoneByUser api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
const getAppliedRequests = async (req, res) => {
  try {
    const { walletId, pageNo, pageSize } = req.query;

    if (!walletId)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    const [data, total_count] = await promotionsRepo.getAppliedPromotions(
      walletId,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    return res.status(200).json({
      data,
      total_count,
    });
  } catch (error) {
    logger.error(`error occurred in approvePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const getAppliedRequestsAdmin = async (req, res) => {
  try {
    const { walletId, pageNo, pageSize } = req.query;
    if (walletId !== config.ADMIN_WALLET_1)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    const [data, total_count] = await promotionsRepo.getAppliedPromotionsAdmin(
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    return res.status(200).json({
      data,
      total_count,
    });
  } catch (error) {
    logger.error(`error occurred in getAppliedRequestsAdmin api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const eligibleForCustomBlogs = async (req, res) => {
  try {
    const { walletId } = req.query;
    if (!walletId)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    const [isEligible, _, __, ___] = await promotionsRepo.blogStats(walletId);
    return res.status(200).json({
      isEligible,
    });
  } catch (error) {
    logger.error(`error occurred in eligibleForPromotion api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

module.exports = {
  eligibleForCustomBlogs,
  savePromotionRequest,
  approvePromotionRequest,
  getAppliedRequests,
  getAppliedRequestsAdmin,
  markAsDoneByUser,
  updateBlogCount,
};
