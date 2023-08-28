const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const { createPostChoreForBlog } = require("../chores");

const initiateProcess = async () => {
  const newBlogs = await blogRepo.newValidatedBlogs();
  for (const blog of newBlogs) {
    console.log("new validated blog found", blog.id);
    await createPostChoreForBlog(blog);
  }
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
