const config = require("../config");
const tokenRepo = require("../repository/token");

const getUserTokens = async (walletId) => {
  let wallets = await tokenRepo.walletBalanceByToken(walletId);
  let tokens = await tokenRepo.totalBalanceByToken();
  const tokensMeta = await tokenRepo.getTokens();
  const walletBalance = wallets[0];
  const tokensBalance = tokens[0];

  const result = [];
  for (const tokenMeta of tokensMeta) {
    const walletValue = walletBalance[`${tokenMeta.token}_balance`];
    const tokenValue = tokensBalance[`${tokenMeta.token}_balance`];
    if (walletValue > 0) {
      const sharePercent = walletValue / tokenValue;
      const allowedBalance = (tokenMeta.allocation_percent * tokenValue) / 100;
      const share = sharePercent * allowedBalance;

      const monthlyShare = config.TOKEN_MONTHLY_ALLOCATION.map((x) =>
        parseInt(x * share)
      );
      result.push({
        total_allocation: parseInt(share),
        monthly_allocations: monthlyShare,
        token: tokenMeta.token,
      });
    }
  }
  return result;
};

module.exports = {
  getUserTokens,
};
