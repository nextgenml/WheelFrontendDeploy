// const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const { validateBlog } = require("../blogs");
const initiateProcess = async () => {
  const blogs = await blogRepo.allBlogs();
  for (const blog of blogs) {
    console.log("new blog for validation ", blog);
    await validateBlog(blog.id);
  }
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
