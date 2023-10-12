const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
} = require("../../constants/momentHelper");
const moment = require("moment");
const { validatePayment } = require("../payments");

const initiateProcess = async () => {
  const today = moment().startOf("day").format(DATE_TIME_FORMAT);
  const walletIds = await blogRepo.uniqueBloggersSince(today);

  for (const wallet of walletIds) {
    await validatePayment(moment().format(DATE_FORMAT), wallet.wallet_address);
  }
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
