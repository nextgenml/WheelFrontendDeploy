const { v4: uuidv4 } = require("uuid");
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
    let { validatedFlag, paidFlag, transactionID, promoted, blog } = req.body;
    if (!(validatedFlag >= 0) || !(paidFlag >= 0) || !transactionID) {
      return res.status(400).json({ msg: "Invalid data" });
    }

    if (blog) {
      await runQueryAsync(
        `UPDATE saved_prompts SET validated_flag = ?, paid_flag = ?, promoted = ?, blog = ? WHERE transactionID = ?`,
        [validatedFlag, paidFlag, promoted, blog, transactionID]
      );
    } else
      await runQueryAsync(
        `UPDATE saved_prompts SET validated_flag = ?, paid_flag = ?, promoted = ? WHERE transactionID = ?`,
        [validatedFlag, paidFlag, promoted, transactionID]
      );

    return res.status(200).json({ msg: "Data updated successfully" });
  } catch (error) {
    logger.error(`updateBlogData error: ${error}`);
    return res.status(500).json({ msg: error });
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
  const pageSize = 10;
  let offset;
  const searchWalletAdd = req.query.searchWalletAdd
    ? req.query.searchWalletAdd
    : "";
  var totalResult, results;

  if (req.query.offset >= 0 && req.query.walletId === config.ADMIN_WALLET_1) {
    offset = req.query.offset;
  } else {
    return res.status(400).json({ msg: "Invalid data" });
  }

  totalRecords = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT count(*) from saved_prompts`,
        async (error, elements) => {
          if (error) {
            // return reject(error);
            return res.status(500).json({ msg: "Internal server error" });
          }
          return resolve(elements);
        }
      );
    });
  };

  totalResult = await totalRecords();
  totalResult = totalResult[0]["count(*)"];

  SelectSearchElements = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * from saved_prompts WHERE wallet_address='${searchWalletAdd}' ORDER BY create_date DESC, wallet_address DESC`,
        async (error, elements) => {
          if (error) {
            // return reject(error);
            return res.status(500).json({ msg: "Internal server error" });
          }
          return resolve(elements);
        }
      );
    });
  };

  if (searchWalletAdd) {
    results = await SelectSearchElements(searchWalletAdd);
    console.log(results);
    totalResult = results ? results.length : 0;
  }

  SelectAllElements = () => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * from saved_prompts ORDER BY create_date DESC, wallet_address DESC LIMIT ${pageSize} OFFSET ${offset}`,
        async (error, elements) => {
          if (error) {
            // return reject(error);
            return res.status(500).json({ msg: "Internal server error" });
          }
          return resolve(elements);
        }
      );
    });
  };

  if (pageSize && offset && !searchWalletAdd) {
    results = await SelectAllElements();
  }

  return res.status(200).json({ totalResult, data: results });
};

const saveBlogData = async (req, res) => {
  const data = req.body;
  const transactionId = uuidv4();

  // Save the data to the database or process it as needed
  const {
    wallet_address,
    initiative,
    prompt,
    blog,
    link,
    validated_flag,
    paid_amount,
    paid_flag,
    promotedWallet,
    promotedId,
  } = req.body;

  if (!wallet_address || !initiative || !prompt || !blog) {
    return res.status(400).json({ msg: "All fields are required" });
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

  const create_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  connection.query(
    `INSERT INTO saved_prompts(transactionID, wallet_address, initiative, prompt, blog, link, create_date, validated_flag, paid_amount, paid_flag, promoted_wallet, promoted_blog_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transactionId,
      wallet_address,
      initiative,
      prompt,
      blog,
      link,
      create_date,
      validated_flag,
      paid_amount,
      paid_flag,
      promotedWallet,
      promotedId,
    ],
    (error, results) => {
      if (error) {
        logger.error(`saveBlogData error: ${error}`);
        return res.status(500).json({ msg: "Internal server error" });
        // return res.status(500).send(error);
      }
      res.status(200).json({ msg: "Data saved successfully" });
    }
  );
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
