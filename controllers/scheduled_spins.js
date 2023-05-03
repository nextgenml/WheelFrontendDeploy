const config = require("../config/env");
const logger = require("../logger");
const blogsManager = require("../manager/blogs");
const { validatePayment } = require("../manager/payments");
const blogsRepo = require("../repository/blogs");
const spinRepo = require("../repository/scheduledSpin");
const moment = require("moment");
require("../manager/jobs/blogPayments");
require("../manager/jobs/blogCampaigns");
require("../manager/jobs/validateOldBlogs");
require("../manager/jobs/oldPayments");
const get = async (req, res) => {
  try {
    const { pageNo, pageSize } = req.query;

    const [data, count] = await spinRepo.getSpins(pageSize * pageNo, pageSize);

    return res.json({ data, count });
  } catch (error) {
    logger.error(`scheduled spins get: ${error}`);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  get,
};
