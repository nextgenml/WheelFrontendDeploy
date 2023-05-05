const choresRepo = require("../repository/chores");
const holdersRepo = require("../repository/holder");
const logger = require("../logger");
const { dashboardStats } = require("../manager/chores");

const topTweets = async (req, res) => {
  try {
    const data = await choresRepo.getTopTweets();
    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error in chores topTweets: ${error}`);
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const adminStats = async (req, res) => {
  try {
    const { pageSize, pageNo, search } = req.query;
    const [holders, count] = await holdersRepo.getHolders(
      parseInt(pageSize * pageNo),
      parseInt(pageSize),
      search
    );
    const result = [];

    for (const holder of holders) {
      const stats = await dashboardStats("twitter", holder.wallet_id);
      result.push({
        ...stats,
        wallet_id: holder.wallet_id,
      });
    }
    res.send({
      data: result,
      count,
    });
  } catch (error) {
    logger.error(`error in chores adminStats: ${error}`);
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  adminStats,
  topTweets,
};
