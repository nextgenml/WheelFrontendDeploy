const {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
  getCampaignImages,
} = require("../../repository/campaignDetails");
const {
  getActiveHolders,
  getHoldersByWalletId,
} = require("../../repository/holder");
const config = require("../../config.js");
const {
  createChore,
  getPreviousCampaignIds,
  markChoreAsCompleted,
} = require("../../repository/chores");
const moment = require("moment");
const { shuffleArray } = require("../../utils");
const logger = require("../../logger");
const schedule = require("node-schedule");
const { searchTweets } = require("../../utils/mediaClients/twitter");
const { areImagesMatching } = require("../../utils/choresHelper");

const createPostChores = async () => {
  try {
    const campaigns = await getActiveCampaigns();
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    for (const holder of holders) {
      const prevCampaignIds = await getPreviousCampaignIds(holder.wallet_id);

      const newCampaigns = campaigns.filter(
        (c) => !prevCampaignIds.includes(c.id)
      );

      const noOfPosts =
        config.NO_OF_POSTS_PER_DAY > newCampaigns.length
          ? newCampaigns.length
          : config.NO_OF_POSTS_PER_DAY;

      const randomCampaigns = shuffleArray(newCampaigns).slice(0, noOfPosts);

      for (const campaign of randomCampaigns) {
        await createChore({
          campaignDetailsId: campaign.id,
          walletId: holder.wallet_id,
          mediaType: campaign.media_type,
          choreType: "post",
          validFrom: moment().add(1, "days").startOf("day").format(),
          validTo: moment()
            .add(config.POST_CHORE_VALID_DAYS, "days")
            .endOf("day")
            .format(),
          value: config.COST_PER_CHORE,
        });
      }
    }
    logger.info("completed creating chores");
  } catch (error) {
    logger.error(`error in creating chores: ${error}`);
  }
};

const gatherPostsFromMedia = async () => {
  try {
    const postedCampaigns = await getPostedCampaigns();

    for (const campaign of postedCampaigns) {
      const campaignImages = await getCampaignImages(campaign.collection_id);
      let searchContentFn = null;
      switch (campaign.media_type) {
        case "twitter":
          searchContentFn = searchTweets;
      }

      if (searchContentFn) {
        const endTime = moment().subtract(10, "seconds").toISOString();
        const postedUsers = await searchContentFn(
          campaign.content,
          moment(
            campaign.last_checked_date || campaign.start_time
          ).toISOString(),
          endTime
        );

        // console.log("postedUsers", postedUsers);
        if (postedUsers.length) {
          const holdersByWalletId = await getHoldersByWalletId(
            postedUsers.map((u) => u.username)
          );

          // console.log("holdersByWalletId", holdersByWalletId);
          for (const user of postedUsers) {
            if (await areImagesMatching(campaignImages, user))
              await markChoreAsCompleted({
                walletId: holdersByWalletId[user.username],
                campaignDetailsId: campaign.id,
                linkToPost: user.postLink,
                mediaPostId: user.postId,
                createdAt: user.createdAt,
              });
          }
        }

        await updateLastCheckedDate(campaign.id, endTime);
      }
    }
    logger.info("completed gatherPostsFromMedia process");
  } catch (error) {
    logger.info(`error in gatherPostsFromMedia process: ${error}`);
  }
};

const rule = new schedule.RecurrenceRule();
const [hours, minutes] = config.CREATE_POST_CHORES_AT;
rule.hour = hours;
rule.minute = minutes;

schedule.scheduleJob(rule, async () => {
  await createPostChores();
  await gatherPostsFromMedia();
});

process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});
