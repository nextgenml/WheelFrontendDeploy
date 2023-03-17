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
    logger.error(`error in getUserTokens: ${e}`);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUserTokens,
};
