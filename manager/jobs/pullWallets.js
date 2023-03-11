const schedule = require("node-schedule");
const logger = require("../../logger");
const { getTokens, updateBlockNumber } = require("../../repository/token");
const { createWallet } = require("../../repository/wallet");
const { pullWallets } = require("../../script/pullTransfers");

const startPulling = async () => {
  try {
    const tokens = await getTokens();

    for (const token of tokens) {
      const [newWallets, lastBlockNumber] = await pullWallets(
        token.contract_address,
        token.abi_file,
        token.last_block_number
      );

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
