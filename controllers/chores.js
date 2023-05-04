const choresRepo = require("../repository/chores");
const logger = require("../logger");

const topTweets = async (req, res) => {
  try {
    const data = await choresRepo.getTopTweets();
    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error in topTweets: ${error}`);
    return res.status(400).json({
      statusCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  topTweets,
};
