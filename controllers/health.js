const choresRepo = require("../repository/chores");
const logger = require("../logger");

const checkDb = async (req, res) => {
  try {
    const data = await choresRepo.getChoresById(1);
    res.json({
      data,
    });
  } catch (error) {
    logger.error(`error in checkDb: ${error}`);
    return res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const checkApp = async (req, res) => {
  res.json({
    message: "ok",
  });
};

module.exports = {
  checkDb,
  checkApp,
};
