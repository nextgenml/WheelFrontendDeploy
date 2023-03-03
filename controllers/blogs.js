const { v4: uuidv4 } = require("uuid");
const { dbConnection } = require("../dbconnect");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const connection = dbConnection;

const updateBlogData = async (req, res) => {
  try {
    let { validatedFlag, paidFlag, transactionID } = req.body;
    if (!(validatedFlag >= 0) || !(paidFlag >= 0) || !transactionID) {
      return res.status(400).json({ msg: "Invalid data" });
    }
    let response;

    updateRecords = () => {
      return new Promise((resolve, reject) => {
        connection.query(
          `UPDATE saved_prompts SET validated_flag = ${validatedFlag}, paid_flag = ${paidFlag} WHERE transactionID = '${transactionID}' `,
          async (error, elements) => {
            if (error) {
              // return reject(error);
              console.log(error);
              return res.status(500).json({ msg: "Internal server error" });
            }
            return resolve(elements);
          }
        );
      });
    };

    response = await updateRecords();
    return res.status(200).json({ msg: "Data updated successfully" });
  } catch (error) {
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

  if (req.query.offset >= 0) {
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
  } = req.body;

  if (
    !wallet_address ||
    !initiative ||
    !prompt ||
    !blog ||
    !link ||
    !paid_amount > 0
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  const create_date = new Date().toISOString().slice(0, 19).replace("T", " ");

  const results = await runQueryAsync(
    "select 1 from saved_prompts where wallet_address = ? and prompt = ?",
    [wallet_address, prompt]
  );
  if (results.length) {
    return res
      .status(500)
      .json({ msg: "Record already saved. You cannot save again" });
  }
  // save in DB
  connection.query(
    `INSERT INTO saved_prompts(transactionID, wallet_address, initiative, prompt, blog, link, create_date, validated_flag, paid_amount, paid_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ],
    (error, results) => {
      if (error) {
        console.log("query error");
        console.log(error);
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
};
