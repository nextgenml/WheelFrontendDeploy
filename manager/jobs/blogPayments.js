const schedule = require("node-schedule");
const {
  createPayment,
  blogsDoneOn,
  updatePayment,
} = require("../../repository/payments");
const blogRepo = require("../../repository/blogs");
const blogsManager = require("../blogs");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const moment = require("moment");

const initiateProcess = async () => {
  const today = moment().startOf("day").format(DATE_TIME_FORMAT);
  const walletIds = await blogRepo.uniqueBloggersSince(today);

  for (const wallet of walletIds) {
    const walletId = wallet.wallet_address;
    console.log("walletId", walletId);

    const date = today.split(" ")[0];
    const todayBlog = await blogsDoneOn(walletId, date);
    if (!todayBlog || todayBlog.amount <= 0) {
      const validated = await blogsManager.hasPostedValidBlogs(
        walletId,
        today,
        true
      );

      if (todayBlog && validated)
        await updatePayment(todayBlog.id, process.env.DAY_BLOG_PRIZE);
      else if (!todayBlog)
        await createPayment(walletId, {
          type: "blog",
          is_paid: 0,
          amount: validated ? process.env.DAY_BLOG_PRIZE : 0,
          earned_at: date,
        });
      console.log("updated for ", walletId);
    }
  }
};
// initiateProcess();
schedule.scheduleJob("0 */1 * * *", async () => {
  await initiateProcess();
});
