const config = require("../config/env");
const logger = require("../logger");
const tokenManager = require("../manager/token");

const getUserTokens = async (req, res) => {
  try {
    const { walletId, search } = req.query;

    const data = await tokenManager.getUserTokens(walletId, search);

    res.json({
      data,
      total_count: data.length,
    });
  } catch (error) {
    logger.error(`error in getUserTokens: ${error}`);
    res.status(500).json({
      message: error.message,
    });
  }
};
const getAdminStats = async (req, res) => {
  try {
    const { walletId } = req.query;

    if (config.ADMIN_WALLET_1 !== walletId)
      return res.status(400).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    const data = await tokenManager.getAdminStats();

    res.json({
      data,
      total_count: data.length,
    });
  } catch (error) {
    logger.error(`error in getAdminStats: ${error}`);
    res.status(500).json({
      message: error.message,
    });
  }
};
const initiatePrizes = async (req, res) => {
  try {
    console.log("reached here");
    res.json({
      success: true,
    });
  } catch (error) {
    logger.error(`error in getAdminStats: ${error}`);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUserTokens,
  getAdminStats,
  initiatePrizes,
};
