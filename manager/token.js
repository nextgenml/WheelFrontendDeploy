const config = require("../config/env");
const { getTopTokenHolders } = require("../repository/holder");
const tokenRepo = require("../repository/token");
const { getMaxSupply } = require("../script/walletBalance");
const { sendEmail } = require("../utils/mailer");
const { formatBalance } = require("./jobs/pullWallets");
const { processPrizesV1 } = require("./rewardTransferV1");

const getMaxSupplies = async (tokens) => {
  const maxSupplyPromises = [];
  for (const token of tokens) {
    maxSupplyPromises.push(getMaxSupply(token));
  }
  const results = await Promise.all(maxSupplyPromises);
  const output = {};

  results.forEach(
    (r) =>
      (output[r.token] = formatBalance(
        r.max,
        tokens.filter((x) => x.token === r.token)[0].decimals
      ))
  );
  return output;
};

const getAdminStats = async () => {
  const tokens = await tokenRepo.getTokens();
  const result = [];

  const maxSupplyPerToken = await getMaxSupplies(tokens);

  for (const token of tokens) {
    const tokenStats = await tokenRepo.getTokenStats(token.token);
    const data = getRowStats(tokenStats.balance, token, maxSupplyPerToken);
    result.push({
      ...data,
      holdersCount: tokenStats.holdersCount,
    });
  }
  return result;
};
const getRowStats = (walletValue, tokenMeta, maxSupplyPerToken) => {
  const maxSupply = maxSupplyPerToken[tokenMeta.token];
  const sharePercent = walletValue / maxSupply;
  const allocation = (config.MAX_SUPPLY * tokenMeta.allocation_percent) / 100;
  const maxAllocation = allocation * sharePercent;

  const monthlyShare = config.TOKEN_MONTHLY_ALLOCATION.map((x) =>
    parseInt(x * maxAllocation)
  );
  return {
    maxAllocation: maxAllocation,
    monthlyAllocations: monthlyShare,
    token: tokenMeta.token,
    walletValue,
    sharePercent: sharePercent * 100,
    maxSupply,
    allocation,
    lastRunAt: tokenMeta.last_run_at,
  };
};

const getUserTokens = async (walletId, search) => {
  const walletIdTemp = search || walletId;

  let wallets = await tokenRepo.walletBalanceByToken(walletIdTemp);
  const tokensMeta = await tokenRepo.getTokens();
  const walletBalance = wallets[0];

  const result = [];
  const maxSupplyPerToken = await getMaxSupplies(tokensMeta);

  for (const tokenMeta of tokensMeta) {
    if (walletBalance) {
      const walletValue = walletBalance[`${tokenMeta.token}_balance`];
      if (walletValue > 0) {
        result.push(getRowStats(walletValue, tokenMeta, maxSupplyPerToken));
      }
    }
  }
  return result;
};

const initiatePrizesDistribution = async (args) => {
  const { token, winners, nml_tokens } = args;
  const holders = await getTopTokenHolders(token, winners);
  const success = (walletId) => {
    console.log(`token prize distribution done for ${walletId}`);
  };
  const failedWalletIds = [];
  const failure = (walletId) => {
    failedWalletIds.push(failedWalletIds);
    console.log(`token prize distribution failed for ${walletId}`);
  };
  for (const holder of holders) {
    const walletId = holder.wallet_id;
    await processPrizesV1(
      [{ walletId, prize: nml_tokens, id: walletId }],
      "nml",
      success,
      failure
    );
  }
  if (failedWalletIds.length) {
    await sendEmail(
      `Allocation ${token} holders transfer failed for the following wallets`,
      failedWalletIds.join(", ")
    );
  } else {
    await sendEmail(
      `Allocation ${token} holders transfer successful`,
      "Thank you"
    );
  }
};
module.exports = {
  getUserTokens,
  getAdminStats,
  initiatePrizesDistribution,
};
