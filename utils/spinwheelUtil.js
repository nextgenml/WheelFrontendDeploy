const { dbConnection } = require("../dbconnect");
const sha256 = require("js-sha256");

const moment = require("moment");
const logger = require("../logger");
const groupByDate = function (xs, key) {
  return xs.reduce(function (rv, x) {
    formatted_key = moment(x[key]).format("YYYY-MM-DD");
    (rv[formatted_key] = rv[formatted_key] || []).push(x);
    return rv;
  }, {});
};

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    formatted_key = x[key];
    (rv[formatted_key] = rv[formatted_key] || []).push(x);
    return rv;
  }, {});
};

const formatTransactionId = (wallet_id, authenticated, walletAddress) => {
  if (authenticated || walletAddress === wallet_id) return wallet_id;
  else {
    const hash = sha256(wallet_id);
    return hash
      ? hash.substring(0, 5) + "..." + hash.substring(hash.length - 5)
      : null;
  }
};

const executeQueryAsync = (query) =>
  new Promise((resolve, reject) => {
    dbConnection.query(query, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

const runQueryAsync = (query, args) =>
  new Promise((resolve, reject) => {
    dbConnection.query(query, args, (error, elements) => {
      // logger.info(`running query: ${query}`);
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

const splitIntoGroups = (a, size) => {
  var arrays = [];
  while (a.length > 0) arrays.push(a.splice(0, size));
  return arrays;
};

module.exports = {
  formatTransactionId,
  groupByDate,
  groupBy,
  executeQueryAsync,
  runQueryAsync,
  splitIntoGroups,
};
