const moment = require("moment");
const { runQueryAsync } = require("../utils/spinwheelUtil");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const createPayment = async (walletId, data) => {
  const query = `insert into payments (type, is_paid, amount, wallet_id, details, earned_at) values(?, ?, ?, ?, ?, ?);`;

  return await runQueryAsync(query, [
    data.type,
    data.is_paid,
    data.amount,
    walletId,
    data.details,
    data.earned_at,
  ]);
};
const updatePayment = async (id, amount) => {
  const query = `update payments set amount = ? where id = ?`;
  return await runQueryAsync(query, [amount, id]);
};

const blogsDoneOn = async (walletId, date) => {
  const query = `select * from payments where wallet_id = ? and earned_at = ? and type = 'blog'`;
  const results = await runQueryAsync(query, [walletId, date]);
  return results[0];
};

const getPayments = async (
  walletId,
  pageSize,
  offset,
  fromDate,
  toDate,
  isAdmin,
  search
) => {
  const start = moment(fromDate).startOf("day").format(DATE_TIME_FORMAT);
  const end = moment(toDate).startOf("day").format(DATE_TIME_FORMAT);
  const query = `select * from payments where earned_at >= ? and earned_at <= ? and (wallet_id = ? or 1 = ?) order by id desc limit ? offset ?;`;
  const data = await runQueryAsync(query, [
    start,
    end,
    search || walletId,
    isAdmin && search ? 0 : 1,
    pageSize,
    offset,
  ]);

  const query1 = `select count(1) as count from payments where earned_at >= ? and earned_at <= ? and (wallet_id = ? or 1 = ?);`;
  const count = await runQueryAsync(query1, [
    start,
    end,
    search || walletId,
    isAdmin && search ? 0 : 1,
  ]);

  return [data, count[0].count];
};

const getPaymentStats = async (walletId) => {
  const query = `select type, sum(amount) as sum from payments where wallet_id = ? group by type;`;
  const results = await runQueryAsync(query, [walletId]);
  const output = {};
  results.forEach((r) => {
    output[r.type] = r.sum;
  });
  return output;
};
module.exports = {
  getPaymentStats,
  createPayment,
  blogsDoneOn,
  getPayments,
  updatePayment,
};
