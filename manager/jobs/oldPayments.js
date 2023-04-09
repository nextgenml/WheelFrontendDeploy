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
const { timer } = require("../../utils");

const initiateProcess = async () => {
  const blogs = await blogRepo.getAllBlogs();

  for (const blog of blogs) {
    const todayBlog = await blogsDoneOn(
      blog.wallet_address,
      moment(blog.date).format("YYYY-MM-DD")
    );

    if (!todayBlog || todayBlog.amount <= 0) {
      const validated = await blogsManager.hasPostedValidBlogsTemp(
        blog.wallet_address,
        blog.date,
        true
      );

      if (todayBlog && validated)
        await updatePayment(todayBlog.id, process.env.DAY_BLOG_PRIZE);
      else if (!todayBlog)
        await createPayment(blog.wallet_address, {
          type: "blog",
          is_paid: 0,
          amount: validated ? process.env.DAY_BLOG_PRIZE : 0,
          earned_at: blog.date,
        });
      console.log("updated for ", blog.wallet_address);
    }
    await timer(5000);
  }
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
