const schedule = require("node-schedule");
const logger = require("../../logger");
const { createHolderV1 } = require("../../repository/holder");
const { getTokens, updateBlockNumber } = require("../../repository/token");
const { createTransaction } = require("../../repository/token_transactions");
const { createWallet } = require("../../repository/wallet");
const { pullWallets } = require("../../script/pullTransfers");

const storeTransactions = async (token, transactions) => {
  for (const transaction of transactions) {
    const { value, from, to } = transaction.returnValues;
    let formattedValue =
      parseInt(
        value.toString().substring(0, value.length - parseInt(token.decimals))
      ) || 0;
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

      for (const item of newWallets) {
        console.log("created wallet", item[0]);
        const value =
          parseInt(item[1].toString().substring(0, item[1].length - 18)) || 0;
        await createWallet(item[0], value, token.token);
      }
      await updateBlockNumber(token.id, lastBlockNumber);
    }
  } catch (error) {
    logger.error(`error in pulling wallets: ${error}`);
  }
};

startPulling();
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
