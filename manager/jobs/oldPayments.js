const schedule = require("node-schedule");
const {
  createPayment,
  blogsDoneOn,
  updatePayment,
} = require("../../repository/payments");
const blogRepo = require("../../repository/blogs");
const blogsManager = require("../blogs");
const { DATE_TIME_FORMAT, DATE_FORMAT } = require("../../constants/momentHelper");
const moment = require("moment");
const { timer } = require("../../utils");
const { validatePayment } = require("../payments");

const initiateProcess = async () => {
  const blogs = await blogRepo.getAllBlogs();

  for (const blog of blogs) {
    await validatePayment(blog.date, blog.wallet_address)
    await timer(5000);
  }
};
initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
