const config = require("../config/env");
const logger = require("../logger");
const referralsRepo = require("../repository/referrals");

const get = async (req, res) => {
  try {
    const { walletId, pageNo, pageSize } = req.query;

    let [data, total_count] = [null, null];
    if (walletId === config.ADMIN_WALLET_1) {
      [data, total_count] = await referralsRepo.getReferralsAdmin(
        parseInt(pageSize) || 10,
        (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
      );
    } else {
      [data, total_count] = await referralsRepo.getReferrals(
        walletId,
        parseInt(pageSize) || 10,
        (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
      );
    }

    return res.status(200).json({
      referrals: data,
      totalCount: total_count,
    });
  } catch (error) {
    logger.error(`error occurred in get referrals api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};
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
  get,
};
