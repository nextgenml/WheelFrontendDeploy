const config = require("../config");
const { dbConnection } = require("../dbconnect");
const logger = require("../logger");
const blogsManager = require("../manager/blogs");
const blogsRepo = require("../repository/blogs");
const promotionsRepo = require("../repository/promotions");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const connection = dbConnection;
const moment = require("moment");
const firstBlogAt = async (req, res) => {
  try {
    const { walletId } = req.query;

    if (!walletId) return res.status(400).json({ msg: "Invalid data" });

    const data = await blogsRepo.firstBlogAt(walletId);
    return res.json({
      createdAt: data[0]?.create_date
        ? moment(data[0]?.create_date).add(5, "hours").add(30, "minutes")
        : null,
    });
  } catch (error) {
    logger.error(`firstBlogAt error: ${error}`);
    return res.status(500).json({ msg: error });
  }
};
const getUserBlogStats = async (req, res) => {
  try {
    const { walletId } = req.query;

    if (!walletId) return res.status(400).json({ msg: "Invalid data" });

    const [_, __, totalCountB, usedCountB] = await promotionsRepo.blogStats(
      walletId
    );
    const [___, ____, totalCountP, usedCountP] =
      await promotionsRepo.promotionStats(walletId);
    return res.json({ totalCountB, usedCountB, totalCountP, usedCountP });
  } catch (error) {
    logger.error(`getCustomBlogs error: ${error}`);
    return res.status(500).json({ msg: error });
  }
};

const updateBlogData = async (req, res) => {
  try {
    let { validatedFlag, walletId, paidFlag, transactionID } = req.body;
    if (!(validatedFlag >= 0) || !(paidFlag >= 0) || !transactionID) {
      return res.status(400).json({
        statusCode: 400,
        msg: "Insufficient data",
      });
    }
    if (walletId !== config.ADMIN_WALLET_1)
      return res.status(401).json({
        statusCode: 401,
        msg: "Unauthorized",
      });

    await blogsRepo.updateBlogData(req.body);
    return res.status(200).json({
      msg: "Updated successfully",
    });
  } catch (error) {
    logger.error(`error occurred in updateBlogData api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      msg: error,
    });
  }
};

const getCustomBlogs = async (req, res) => {
  try {
    const { walletId, pageSize, pageNo, search } = req.query;

    if (!walletId) return res.status(400).json({ msg: "Invalid data" });

    const [totalResult, data] = await blogsRepo.getCustomBlogs(
      walletId,
      walletId === config.ADMIN_WALLET_1,
      search,
      parseInt(pageSize) || 10,
      (parseInt(pageSize) || 10) * (parseInt(pageNo) || 0)
    );
    return res.json({ data, totalResult });
  } catch (error) {
    logger.error(`getCustomBlogs error: ${error}`);
    return res.status(500).json({ msg: error });
  }
};

const getBlogStats = async (req, res) => {
  try {
    const { walletId, blogId } = req.query;

    if (!walletId || !blogId)
      return res.status(400).json({ msg: "Invalid data" });

    const data = await blogsRepo.getBlogStats(blogId);
    return res.json({ data });
  } catch (error) {
    logger.error(`getCustomBlogs error: ${error}`);
    return res.status(500).json({ msg: error });
  }
};

const getPromotedBlogs = async (req, res) => {
  try {
    console.log("reached jere");
    const { walletId } = req.query;

    if (!walletId) return res.status(400).json({ msg: "Invalid data" });
    const [data, total] = await blogsManager.getPromotedBlogs(walletId);
    return res.json({ data, total });
  } catch (error) {
    logger.error(`getPromotedBlogs error: ${error}`);
    return res.status(500).json({ msg: error });
  }
};

const getBlogData = async (req, res) => {
  try {
    const pageSize = 10;
    let offset;
    const searchWalletAdd = req.query.searchWalletAdd
      ? req.query.searchWalletAdd
      : "";
    var totalResult, results;

    if (req.query.walletId !== config.ADMIN_WALLET_1)
      return res.status(401).json({
        statusCode: 401,
        msg: "Unauthorized",
      });

    if (req.query.offset >= 0 && req.query.walletId === config.ADMIN_WALLET_1) {
      offset = req.query.offset;
    } else {
      return res.status(400).json({ msg: "Invalid data" });
    }

    [totalResult] = await blogsRepo.totalBlogs();

    if (searchWalletAdd) {
      [results] = await blogsRepo.selectSearchElements(searchWalletAdd);
      totalResult = results ? results.length : 0;
    }

    if (pageSize && offset && !searchWalletAdd) {
      [results] = await blogsRepo.selectAllElements(pageSize, offset);
    }

    return res.status(200).json({
      totalResult,
      data: results,
    });

  } catch (error) {
    logger.error(`error occurred in getBlogData api: ${error}`);
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  }
};

const saveBlogData = async (req, res) => {
  const data = req.body;
  // Save the data to the database or process it as needed
  const {
    wallet_address,
    initiative,
    prompt,
    blog
  } = req.body;

  if (!wallet_address || !initiative || !prompt || !blog) {
    return res.status(400).json({ msg: "Invalid data" });
  }
  // Blogs limit validation
  if (initiative === "blog-customization") {
    const [valid, message, _, __] = await promotionsRepo.blogStats(
      wallet_address
    );
    if (!valid) return res.status(401).json({ msg: message });
  }

  // Stop same prompt being saved
  const results = await runQueryAsync(
    "select 1 from saved_prompts where wallet_address = ? and prompt = ?",
    [wallet_address, prompt]
  );
  if (results.length) {
    return res
      .status(400)
      .json({ msg: "Record already saved. You cannot save again" });
  }

  await blogsRepo.saveBlogData(req.body);
  return res.status(200).json({
    msg: "Saved successfully",
  });
};
module.exports = {
  updateBlogData,
  getBlogData,
  saveBlogData,
  getCustomBlogs,
  getPromotedBlogs,
  getBlogStats,
  getUserBlogStats,
  firstBlogAt,
};
