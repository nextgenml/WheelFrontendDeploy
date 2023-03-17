const config = require("../config");
const tokenRepo = require("../repository/token");
const { getMaxSupply } = require("../script/walletBalance");

const getAdminStats = async () => {
  const tokens = await tokenRepo.getTokens();
  const result = [];
  const maxSupplyPromises = [];
  for (const token of tokens) {
    maxSupplyPromises.push(getMaxSupply(token));
  }
  const maxSupplyPerToken = await Promise.all(maxSupplyPromises);
  for (const token of tokens) {
    const tokenStats = await tokenRepo.getTokenStats(token.token);
    const maxSupply = maxSupplyPerToken.filter((x) => x.token == token.token)[0]
      ?.max;
    const qualifiedFor = parseInt(
      (token.allocation_percent * tokenStats.balance) / 100
    );
    const monthlyShare = config.TOKEN_MONTHLY_ALLOCATION.map((x) =>
      parseInt(x * qualifiedFor)
    );
    result.push({
      maxSupply,
      qualifiedFor,
      balance: tokenStats.balance,
      holdersCount: tokenStats.holdersCount,
      token: token.token,
      monthlyShare,
    });
  }
  return result;
};
const getUserTokens = async (walletId, search) => {
  const walletIdTemp =
    config.ADMIN_WALLET_1 === walletId ? search || walletId : walletId;

  let wallets = await tokenRepo.walletBalanceByToken(walletIdTemp);
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
  getAdminStats,
};
