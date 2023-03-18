const config = require("../config/env");
const tokenRepo = require("../repository/token");
const { getMaxSupply } = require("../script/walletBalance");
const { formatBalance } = require("./jobs/pullWallets");

const getMaxSupplies = async (tokens) => {
  // const maxSupplyPromises = [];
  // for (const token of tokens) {
  //   maxSupplyPromises.push(getMaxSupply(token));
  // }
  // const results = await Promise.all(maxSupplyPromises);
  // const output = {};

  // results.forEach(
  //   (r) =>
  //     (output[r.token] = formatBalance(
  //       r.max,
  //       tokens.filter((x) => x.token === r.token)[0].decimals
  //     ))
  // );
  const output = {};
  for (const token of tokens) {
    output[token.token] = config.MAX_SUPPLY;
  }
  return output;
};
const getAdminStats = async () => {
  const tokens = await tokenRepo.getTokens();
  const result = [];

  const maxSupplyPerToken = await getMaxSupplies(tokens);

  for (const token of tokens) {
    const tokenStats = await tokenRepo.getTokenStats(token.token);
    const maxSupply = maxSupplyPerToken[token.token];
    const qualifiedFor = parseInt((token.allocation_percent * maxSupply) / 100);
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
  const tokensMeta = await tokenRepo.getTokens();
  const walletBalance = wallets[0];

  const result = [];
  const maxSupplyPerToken = await getMaxSupplies(tokensMeta);

  for (const tokenMeta of tokensMeta) {
    if (walletBalance) {
      const walletValue = walletBalance[`${tokenMeta.token}_balance`];
      if (walletValue > 0) {
        const maxSupply = maxSupplyPerToken[tokenMeta.token];
        const sharePercent = walletValue / maxSupply;
        const allocation = (maxSupply * tokenMeta.allocation_percent) / 100;
        const maxAllocation = allocation * sharePercent;

        const monthlyShare = config.TOKEN_MONTHLY_ALLOCATION.map((x) =>
          parseInt(x * maxAllocation)
        );
        result.push({
          maxAllocation: maxAllocation,
          monthly_allocations: monthlyShare,
          token: tokenMeta.token,
          walletValue,
          sharePercent: sharePercent * 100,
          maxSupply,
          allocation,
          lastRunAt: tokenMeta.last_run_at,
        });
      }
    }
  }
  return result;
};

module.exports = {
  getUserTokens,
  getAdminStats,
};
