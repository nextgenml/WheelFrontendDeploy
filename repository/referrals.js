const { runQueryAsync } = require("../utils/spinwheelUtil");

const create = async (referer, referee) => {
  const query = `insert into referrals(referer, referee, referred_at) values(?, ?, now())`;
  return await runQueryAsync(query, [referer, referee]);
};

const checkReplica = async (referee) => {
  const query = `select 1 from referrals where referee = ?`;
  return await runQueryAsync(query, [referee]);
};

module.exports = {
  create,
  checkReplica,
};
