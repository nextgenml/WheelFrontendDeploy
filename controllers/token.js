const logger = require("../logger");
const tokenManager = require("../manager/token");

const getUserTokens = async (req, res) => {
  try {
    const walletId = req.query.walletId;

    const data = await tokenManager.getUserTokens(walletId);

    res.json({
      data,
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
