const config = require("../config/env");
const logger = require("../logger");
const moment = require("moment");
const blogsManager = require("../manager/blogs");
const { blogsSince } = require("../repository/blogs");
const { getByTwitter } = require("../repository/holder");
const referralsRepo = require("../repository/referrals");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
require("../manager/jobs/referrals");
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
      for (const ref of data) {
        const holder = await getByTwitter(ref.referee_twitter);
        if (holder) {
          const blogsPosted = await blogsSince(
            holder.wallet_id,
            moment().startOf("day").format(DATE_TIME_FORMAT)
          );
          ref.criteria_count = blogsPosted.length;
        }
      }
    }

    return res.status(200).json({
      referrals: data,
      totalCount: total_count,
    });
  } catch (error) {
    logger.error(`error occurred in get referrals api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};
const create = async (req, res) => {
  try {
    const { walletId } = req.query;
    let { twitter, telegram } = req.body;
    twitter = blogsManager.replaceTrailingSlash(twitter);
    telegram = blogsManager.replaceTrailingSlash(telegram);

    // if (walletId === referee)
    //   return res.status(400).json({
    //     message: "You cannot refer yourself",
    //   });

    const exists = await referralsRepo.checkReplica(twitter);
    if (exists.length)
      return res.status(400).json({
        message: "Referral already exists",
      });

    await referralsRepo.create(walletId, twitter, telegram);

    return res.json({
      message: "Update successful",
    });
  } catch (error) {
    logger.info(`Referral create: ${error}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};
const update = async (req, res) => {
  try {
    const { walletId } = req.query;
    let { paid } = req.body;
    let { id } = req.params;

    if (walletId !== config.ADMIN_WALLET_1)
      return res.status(400).json({
        message: "Unauthorized",
      });

    await referralsRepo.update(id, paid);

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
  update,
};
