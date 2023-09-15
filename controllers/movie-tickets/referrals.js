const { getByInviteCode } = require("../../repository/holder");
const {
  createMovieReferral,
  totalReferrals,
} = require("../../repository/movie_referrals");

const create = async (req, res) => {
  const { walletId } = req.query;
  const { inviteCode } = req.body;

  const referer = await getByInviteCode(inviteCode);

  if (referer && inviteCode) {
    await createMovieReferral(referer.wallet_id, walletId, inviteCode);
  }
  res.json({
    message: "success",
  });
};
const get = async (req, res) => {
  let { viewAs, walletId } = req.query;
  if (viewAs && walletId !== process.env.ADMIN_WALLET)
    return res.status(401).json({
      message: "Unauthorized",
    });
  walletId = viewAs || walletId;

  const count = await totalReferrals(walletId);
  console.log("count", count);
  res.json({
    rewards: count * process.env.MOVIE_TICKETS_REFERRAL_REWARD_POINTS,
  });
};
module.exports = {
  create,
  get,
};
