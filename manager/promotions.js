const holdersRepo = require("../repository/holder");
const promotionsRepo = require("../repository/promotions");
const isEligibleForBlogging = async (walletId) => {
  const holder = await holdersRepo.getById(walletId);

  if (
    holder &&
    holder.nml_balance >= process.env.MIN_WALLET_BALANCE_TO_DO_BLOGGING
  )
    return true;
  const [valid, _, __, ___] = await promotionsRepo.blogStats(walletId);
  return valid;
};
module.exports = {
  isEligibleForBlogging,
};
