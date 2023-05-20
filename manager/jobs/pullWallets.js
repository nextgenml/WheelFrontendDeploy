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
const { updateDiamondHolders } = require("./updateDiamondHolder");
const formatBalance = (value, decimals) => {
  return (
    parseInt(
      value.toString().substring(0, value.length - parseInt(decimals))
    ) || 0
  );
};
const storeTransactions = async (token, transactions, blockEndNumber) => {
  const walletIds = [];
  const promises = [];
  for (const transaction of transactions) {
    const { value, from, to } = transaction.returnValues;
    let formattedValue = formatBalance(value, token.decimals);

    promises.push(createTransaction(transaction, formattedValue, token.token));

    if (to !== token.contract_address) {
      promises.push(createHolderV1(to));
      walletIds.push(to);
    }
    if (from !== token.contract_address) {
      promises.push(createHolderV1(from));
      walletIds.push(from);
    }
  }
  console.log("awaiting promises", promises.length);
  await Promise.all(promises);
  await updateBlockNumber(token.id, blockEndNumber);
  await updateBalances(walletIds, token);
  await updateLastRunAt(token.id, moment.utc().format(DATE_TIME_FORMAT));
};
const startPulling = async () => {
  try {
    const tokens = await getTokens();

    for (const token of tokens) {
      const lastBlockNumber = await pullWallets(token, storeTransactions);

      await updateBlockNumber(token.id, lastBlockNumber);
      // await updateBalances(token);
      console.log("updated balances for ", token.token);
    }
  } catch (error) {
    logger.error(`error in pulling wallets: ${error}`);
  }
};

const updateBalances = async (walletIds, token) => {
  let [min_id, max_id] = [0, walletIds.length];
  const contract = await getContract(token.contract_address, token.abi_file);
  console.log("updateBalances for token", token.token, walletIds.length);
  while (min_id < max_id) {
    const current_max_id = min_id + 1000;
    const holders = walletIds.slice(min_id, current_max_id);
    console.log("min_id < max_id", min_id, current_max_id);

    const balances = await getBalances(contract, holders);

    for (const b of balances) {
      await updateHolderBalance(
        b.walletId,
        formatBalance(b.balance, token.decimals),
        token.token
      );
    }

    min_id = current_max_id;
  }
};
const updateAllBalances = async () => {
  const tokens = await getTokens();

  for (const token of tokens) {
    let { max_id, min_id } = await getHoldersMeta();
    const contract = await getContract(token.contract_address, token.abi_file);

    while (min_id < max_id) {
      const current_max_id = min_id + 1000;
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
    await updateLastRunAt(token.id, moment.utc().format(DATE_TIME_FORMAT));
  }
};

const initiateProcess = async () => {
  logger.info("started pulling wallets from smart contract");
  await startPulling();
  logger.info(
    "Completed pulling wallets from smart contract and getting balances"
  );
  logger.info("completed getting balances");
};
// initiateProcess();
schedule.scheduleJob("0 */3 * * *", async () => {
  await initiateProcess();
  await updateAllBalances();
  await updateDiamondHolders();
});
process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});

module.exports = {
  formatBalance,
};
