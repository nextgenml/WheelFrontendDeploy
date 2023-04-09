// const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const { timer } = require("../../utils");
const { validateBlog } = require("../blogs");
const initiateProcess = async () => {
  const blogs = await blogRepo.allBlogs();
  const promises = [];
  for (const blog of blogs) {
    // console.log("new blog for validation ", blog);
    await validateBlog(blog.id);
    await timer(5);
    // promises.push(validateBlog(blog.id));
  }
  // await Promise.all(promises);
  console.log("all blogs are updated");
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
