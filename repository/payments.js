const moment = require("moment");
const { runQueryAsync } = require("../utils/spinwheelUtil");
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

const getPayments = async (walletId, date, pageSize, offset) => {
  const query = `select * from payments where wallet_id = ? and earned_at = ? order by id desc limit ? offset ?;`;
  const date1 = moment(date).format("YYYY-MM-DD");
  const data = await runQueryAsync(query, [walletId, date1, pageSize, offset]);

  const query1 = `select count(1) as count from payments where  wallet_id = ? and earned_at = ?;`;
  const count = await runQueryAsync(query1, [walletId, date1]);

  return [data, count[0].count];
};
module.exports = {
  createPayment,
  blogsDoneOn,
  getPayments,
  updatePayment,
};
