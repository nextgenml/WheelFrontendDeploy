const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const campaignRepo = require("../../repository/campaignDetails");
const choresRepo = require("../../repository/chores");
const moment = require("moment");
const uuid = require("uuid");
const { NXML_BLOG_CAMPAIGN } = require("../../constants");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const initiateProcess = async () => {
  const newBlogs = await blogRepo.newValidatedBlogs();
  for (const blog of newBlogs) {
    console.log("new validated blog found", blog.id);
    let { insertId } = await campaignRepo.saveCampaign({
      client: "NexgenML",
      campaign_name: NXML_BLOG_CAMPAIGN,
      start_time: moment(),
      end_time: moment().add(3, "months"),
      success_factor: "best",
      wallet_id: process.env.ADMIN_WALLET,
      default: blog.prompt === 'blog-customization' ? "false" : "true",
      reward: process.env.COST_PER_CHORE,
      blogId: blog.id,
      is_recursive_algo: 1,
    });

    const details = await campaignRepo.saveCampaignDetails({
      content: blog.prompt,
      start_time: moment(),
      end_time: moment().add(3, "months"),
      campaign_id: insertId,
      content_type: "text",
      collection_id: uuid.v4(),
      media_type: "twitter",
      post_link: blog.twitterurl,
    });

    const split = blog.twitterurl.split("/");
    const followLink = split.slice(0, split.length - 2).join("/");
    const postId = split[split.length - 1];

    const chore = await choresRepo.createChore({
      campaignDetailsId: details[1].insertId,
      walletId: process.env.ADMIN_WALLET,
      mediaType: "twitter",
      choreType: "post",
      validFrom: moment().format(DATE_TIME_FORMAT),
      validTo: moment().add(3, "months").format(DATE_TIME_FORMAT),
      value: process.env.COST_PER_CHORE,
      content: blog.prompt,
    });

    await choresRepo.markChoreAsCompleted({
      linkToPost: blog.twitterurl,
      mediaPostId: postId,
      followLink,
      createdAt: moment().subtract(1, "hour").format(DATE_TIME_FORMAT),
      id: chore[1].insertId,
      walletId: process.env.ADMIN_WALLET,
      campaignDetailsId: details[1].insertId,
      choreType: "post",
    });
  }
};
initiateProcess();
schedule.scheduleJob("0 */1 * * *", async () => {
  await initiateProcess();
});
