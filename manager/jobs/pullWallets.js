const schedule = require("node-schedule");
const logger = require("../../logger");
const {
  createHolderV1,
  getHoldersMeta,
  getHolderByPage,
  updateHolderBalance,
} = require("../../repository/holder");
const {
  getTokens,
  updateBlockNumber,
  updateLastRunAt,
} = require("../../repository/token");
const { createTransaction } = require("../../repository/token_transactions");
const { pullWallets, getContract } = require("../../script/pullTransfers");
const { getBalances } = require("../../script/walletBalance");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const formatBalance = (value, decimals) => {
  return (
    parseInt(
      value.toString().substring(0, value.length - parseInt(decimals))
    ) || 0
  );
};
const storeTransactions = async (token, transactions) => {
  for (const transaction of transactions) {
    const { value, from, to } = transaction.returnValues;
    let formattedValue = formatBalance(value, token.decimals);

    await createTransaction(transaction, formattedValue, token.token);

    if (to !== token.contract_address) await createHolderV1(to);
    if (from !== token.contract_address) await createHolderV1(from);
  }
};
const startPulling = async () => {
  try {
    const tokens = await getTokens();

    for (const token of tokens) {
      const lastBlockNumber = await pullWallets(token, storeTransactions);

      await updateBlockNumber(token.id, lastBlockNumber);
    }
  } catch (error) {
    logger.error(`error in pulling wallets: ${error}`);
  }
};

const updateBalances = async () => {
  let { max_id, min_id } = await getHoldersMeta();

  const tokens = await getTokens();
  for (const token of tokens) {
    const contract = await getContract(token.contract_address, token.abi_file);

    while (min_id < max_id) {
      const current_max_id = min_id + 100;
      const holders = await getHolderByPage(min_id, current_max_id);
      console.log("min_id < max_id", min_id, current_max_id);

      const balances = await getBalances(
        contract,
        holders.map((h) => h.wallet_id)
      );

      for (const b of balances) {
        await updateHolderBalance(
          b.walletId,
          formatBalance(b.balance, token.decimals),
          token.token
        );
      }

      min_id = current_max_id;
    }
    await updateLastRunAt(1, moment.utc().format(DATE_TIME_FORMAT));
  }
};
// startPulling();
// updateBalances();

schedule.scheduleJob("0 */3 * * *", async () => {
  logger.info("started pulling wallets from smart contract");
  await startPulling();
  logger.info(
    "completed pulling wallets from smart contract and getting balances"
  );
  await updateBalances();
  logger.info("completed getting balances");
});
process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});

module.exports = {
  formatBalance,
};
