const blogRepo = require("../../repository/blogs");
const { timer } = require("../../utils");
const { validatePayment } = require("../payments");

const initiateProcess = async () => {
  const blogs = await blogRepo.getAllBlogs();

  for (const blog of blogs) {
    await validatePayment(blog.date, blog.wallet_address);
    await timer(5000);
  }
};
// initiateProcess();
