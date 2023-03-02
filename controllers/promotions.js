const config = require("../config");
const promotionsRepo = require("../repository/promotions");

const savePromotionRequest = async (req, res) => {
  try {
    if (
      !req.body.payer_wallet_id ||
      !req.body.receiver_wallet_id ||
      !req.body.eth_amount ||
      !req.body.overall_promotions_limit
    )
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient data sent to server",
      });

    await promotionsRepo.savePromotion(req.body);
  } catch (error) {
    logger.error(`error occurred in savePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
const approvePromotionRequest = async (req, res) => {
  try {
    if (!req.body.request_id || !req.body.status)
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient data",
      });

    if (req.wallet_id !== config.ADMIN_WALLET)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    await promotionsRepo.updatePromotion(req.body);
  } catch (error) {
    logger.error(`error occurred in approvePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
const getAppliedRequests = async (req, res) => {
  try {
    if (!req.wallet_id)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    await promotionsRepo.updatePromotion(req.body);
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
    if (walletId !== config.ADMIN_WALLET)
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    await promotionsRepo.getAppliedPromotionsAdmin(
      req.body,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
  } catch (error) {
    logger.error(`error occurred in approvePromotionRequest api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

module.exports = {
  savePromotionRequest,
  approvePromotionRequest,
  getAppliedRequests,
  getAppliedRequestsAdmin,
};
