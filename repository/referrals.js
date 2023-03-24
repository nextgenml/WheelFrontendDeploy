const { runQueryAsync } = require("../utils/spinwheelUtil");

const create = async (referer, referee) => {
  const query = `insert into referrals(referer, referee, referred_at) values(?, ?, now())`;
  return await runQueryAsync(query, [referer, referee]);
};

const checkReplica = async (referee) => {
  const query = `select 1 from referrals where referee = ?`;
  return await runQueryAsync(query, [referee]);
};

const getReferrals = async (walletId, pageSize, offset) => {
  const query = `select * from referrals where referer = ? order by id desc limit ? offset ?;`;

  const data = await runQueryAsync(query, [walletId, pageSize, offset]);

  const query1 = `select count(1) as count from referrals where referer = ?`;
  const count = await runQueryAsync(query1, [walletId]);

  return [data, count[0].count];
};

const getReferralsAdmin = async (pageSize, offset) => {
  const query = `select * from referrals order by id desc limit ? offset ?;`;

  const data = await runQueryAsync(query, [pageSize, offset]);

  const query1 = `select count(1) as count from referrals`;
  const count = await runQueryAsync(query1);

  return [data, count[0].count];
};

module.exports = {
  create,
  checkReplica,
  getReferrals,
  getReferralsAdmin,
};
