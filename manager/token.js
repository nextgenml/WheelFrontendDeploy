const config = require("../config");
const tokenRepo = require("../repository/token");

const getUserTokens = async (walletId) => {
  let wallets = await tokenRepo.walletBalanceByToken(walletId);
  let tokens = await tokenRepo.totalBalanceByToken();

  const result = [];
  wallets.forEach((wallet) => {
    const token = tokens.filter((x) => x.token == wallet.token)[0];

    const sharePercent = wallet.value / token.value;

    const allowedBalance = config.TOKEN_ALLOCATION_PERCENT * token.value;

    const share = sharePercent * allowedBalance;

    const monthlyShare = config.TOKEN_MONTHLY_ALLOCATION.map((x) =>
      parseInt(x * share)
    );
    result.push({
      total_allocation: parseInt(share),
      monthly_allocations: monthlyShare,
      token: token.token,
    });
  });

  return result;
};

module.exports = {
  getUserTokens,
};