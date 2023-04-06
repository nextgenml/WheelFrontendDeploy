const schedule = require("node-schedule");
const { createPayment, blogsDoneOn } = require("../../repository/payments");
const blogRepo = require("../../repository/blogs");
const blogsManager = require("../blogs");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const moment = require("moment");

const initiateProcess = async () => {
  const today = moment().startOf("day").format(DATE_TIME_FORMAT);
  const walletIds = await blogRepo.uniqueBloggersSince(today);

  for (const wallet of walletIds) {
    const walletId = wallet.wallet_address;
    console.log("walletId", walletId, blogsManager.referralMet);

    const date = today.split(" ")[0];
    const alreadyDone = await blogsDoneOn(walletId, date);
    if (!alreadyDone) {
      const validated = await blogsManager.hasPostedValidBlogs(walletId, today);
      await createPayment(walletId, {
        type: "blog",
        is_paid: 0,
        amount: validated ? 1 : 0,
        earned_at: date,
      });
      console.log("updated for ", walletId);
    }
  }
};
initiateProcess();
schedule.scheduleJob("0 */1 * * *", async () => {
  await initiateProcess();
});
