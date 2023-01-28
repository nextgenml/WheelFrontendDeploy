const holderRepo = require("../repository/holder");

const getWalletDetails = async (req, res) => {
  try {
    const { walletId } = req.query;
    if (!walletId)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet is missing",
      });

    const wallet = await holderRepo.getById(walletId);

    res.json({
      alias: wallet?.alias,
    });
  } catch (error) {
    logger.error(`error occurred in getWalletDetails api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const updateAlias = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { newAlias } = req.body;
    console.log("req.query", req.query, "req.body;", req.body);
    if (!walletId || !newAlias)
      return res.status(400).json({
        statusCode: 400,
        message: "wallet or alias is missing",
      });

    if (await holderRepo.aliasExists(walletId, newAlias))
      return res.status(400).json({
        statusCode: 400,
        message: "Alias already taken by other user",
      });
    await holderRepo.updateAlias(walletId, newAlias);
    return res.json({
      message: "Alias updated successfully",
    });
  } catch (error) {
    logger.error(`error occurred in updateAlias api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

module.exports = {
  getWalletDetails,
  updateAlias,
};
