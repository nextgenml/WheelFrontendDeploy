const { dbConnection } = require("../dbconnect");
const moment = require("moment");
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

const formatTransactionId = (transaction_id) =>
  transaction_id
    ? transaction_id.substring(0, 5) +
      "..." +
      transaction_id.substring(transaction_id.length - 5)
    : null;

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
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });

module.exports = {
  formatTransactionId,
  groupByDate,
  groupBy,
  executeQueryAsync,
  runQueryAsync,
};
