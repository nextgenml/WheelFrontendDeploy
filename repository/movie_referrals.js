const { runQueryAsync } = require("../utils/spinwheelUtil");

const createMovieReferral = async (referer, referee, inviteCode) => {
  const query1 = `select 1 from movie_referrals where referee = ?`;
  const results1 = await runQueryAsync(query1, [referee]);

  if (results1.length === 0) {
    const query2 = `insert into movie_referrals(referer, referee, invite_code, complete) values(?, ?, ?, 0)`;
    return await runQueryAsync(query2, [referer, referee, inviteCode]);
  }
};

const totalReferrals = async (walletId) => {
  const query = `select count(1) as count from movie_referrals where complete = 1 and referer = ?`;
  const results = await runQueryAsync(query, [walletId]);
  return results[0].count;
};

const markReferralAsDone = async (walletId) => {
  const query = `update movie_referrals set complete = 1 where referee = ?`;
  return await runQueryAsync(query, [walletId]);
};
module.exports = {
  createMovieReferral,
  totalReferrals,
  markReferralAsDone,
};
