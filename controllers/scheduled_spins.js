const logger = require("../logger");
const spinRepo = require("../repository/scheduledSpin");
require("../manager/jobs/blogPayments");
require("../manager/jobs/blogCampaigns");
require("../manager/jobs/validateOldBlogs");
require("../manager/jobs/oldPayments");
const get = async (req, res) => {
  try {
    const { pageNo, pageSize } = req.query;

    const [data, count] = await spinRepo.getSpins(
      parseInt(pageSize * pageNo),
      parseInt(pageSize)
    );

    return res.json({ data, count });
  } catch (error) {
    logger.error(`scheduled spins get: ${error}`);
    return res.status(500).json({ msg: error.message });
  }
};

const create = async (req, res) => {
  try {
    await spinRepo.createSpin(req.body);

    return res.json({ message: "Spin created successfully" });
  } catch (error) {
    logger.error(`scheduled spins get: ${error}`);
    return res.status(500).json({ msg: error.message });
  }
};
const update = async (req, res) => {
  try {
    await spinRepo.updateSpin(req.body);

    return res.json({ message: "Spin created successfully" });
  } catch (error) {
    logger.error(`scheduled spins get: ${error}`);
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  update,
  get,
  create,
};
