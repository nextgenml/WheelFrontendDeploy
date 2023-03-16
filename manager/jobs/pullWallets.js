const schedule = require("node-schedule");
const logger = require("../../logger");
const {
  createHolderV1,
  getHoldersMeta,
  getHolderByPage,
  updateHolderBalance,
} = require("../../repository/holder");
const { getTokens, updateBlockNumber } = require("../../repository/token");
const { createTransaction } = require("../../repository/token_transactions");
const { pullWallets, getContract } = require("../../script/pullTransfers");
const { getBalance } = require("../../script/walletBalance");

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
    const userWalletId = to === token.contract_address ? from : to;
    await createHolderV1(userWalletId);
  }
};
const startPulling = async () => {
  try {
    const tokens = await getTokens();

    for (const token of tokens) {
      const lastBlockNumber = await pullWallets(token, storeTransactions);

      await updateBlockNumber(token.id, lastBlockNumber);
      break;
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
      for (const holder of holders) {
        const balance = await getBalance(contract, holder.wallet_id);
        await updateHolderBalance(
          holder.id,
          formatBalance(balance, token.decimals),
          token.token
        );
      }
      min_id = current_max_id;
    }
    break;
  }
};
// startPulling();
updateBalances();
// const rule = new schedule.RecurrenceRule();
// const [hours, minutes] = config.CREATE_POST_CHORES_AT;
// rule.hour = hours;
// rule.minute = minutes;

// schedule.scheduleJob(rule, async () => {
//   logger.info("started chores process");
//   await startPulling();
// });
// process.on("SIGINT", () => {
//   console.log("closing");
//   schedule.gracefulShutdown().then(() => process.exit(0));
// });
