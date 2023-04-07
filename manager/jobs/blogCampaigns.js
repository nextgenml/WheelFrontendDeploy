const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const campaignRepo = require("../../repository/campaignDetails");
const blogsManager = require("../blogs");
const moment = require("moment");
const uuid = require("uuid");
const initiateProcess = async () => {
  const newBlogs = await blogRepo.newValidatedBlogs();
  for (const blog of newBlogs) {
    console.log("blog", blog.id);
    const { insertId } = await campaignRepo.saveCampaign({
      client: "NexgenML",
      campaign_name: "NexgenML",
      start_time: moment(),
      end_time: moment().add(3, "months"),
      success_factor: "best",
      wallet_id: process.env.ADMIN_WALLET,
      is_default: 1,
      reward: process.env.COST_PER_CHORE,
      blogId: blog.id,
    });

    await campaignRepo.saveCampaignDetails({
      content: blog.prompt,
      start_time: moment(),
      end_time: moment().add(3, "months"),
      campaign_id: insertId,
      content_type: "text",
      collection_id: uuid.v4(),
      media_type: "twitter",
    });
  }
};
initiateProcess();
schedule.scheduleJob("0 */1 * * *", async () => {
  await initiateProcess();
});
