const { runQueryAsync } = require("../utils/spinwheelUtil");

const create = async (referer, twitter, telegram) => {
  const query = `insert into referrals(referer, referee_twitter, referee_telegram, referred_at) values(?, ?, ?, now())`;
  return await runQueryAsync(query, [referer, twitter, telegram]);
};

const checkReplica = async (twitter) => {
  const query = `select 1 from referrals where referee_twitter = ?`;
  return await runQueryAsync(query, [twitter]);
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

const getIncompleteReferrals = async () => {
  const query = `select * from referrals where criteria_met = 0 order by id desc;`;

  return await runQueryAsync(query, []);
};

const updateSuccessCriteria = async (id, count) => {
  const query = `update referrals set criteria_met = 1, criteria_met_at=now(), criteria_count=? where id = ?`;
  return await runQueryAsync(query, [count, id]);
};
module.exports = {
  create,
  checkReplica,
  getReferrals,
  getReferralsAdmin,
  getIncompleteReferrals,
  updateSuccessCriteria,
};
