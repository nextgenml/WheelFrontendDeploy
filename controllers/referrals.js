const logger = require("../logger");
const referralsRepo = require("../repository/referrals");

const create = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { referee } = req.body;

    if (walletId === referee)
      return res.status(400).json({
        message: "You cannot refer yourself",
      });

    const exists = await referralsRepo.checkReplica(referee);
    if (exists.length)
      return res.status(400).json({
        message: "Referral already exists",
      });

    await referralsRepo.create(walletId, referee);

    return res.json({
      message: "Create successful",
    });
  } catch (error) {
    logger.info(`Referral create: ${error}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {
  create,
};
