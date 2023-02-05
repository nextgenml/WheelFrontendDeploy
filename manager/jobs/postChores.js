const {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
  canCreateChore,
  getDefaultCampaign,
} = require("../../repository/campaignDetails");
const {
  getActiveHolders,
  getHoldersByWalletId,
  updateMediaIds,
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
const {
  createOtherChores,
  checkIfOtherChoresCompleted,
} = require("./otherChores");
const { createFollowChores, checkIfFollowComplete } = require("./followChores");
const { transferRewards } = require("./transferRewards");
const { convert } = require("html-to-text");
const { updateWallets } = require("../wallet");

const createPostChores = async (campaigns) => {
  try {
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

      if (randomCampaigns.length < config.NO_OF_POSTS_PER_DAY) {
        const defaultCampaign = await getDefaultCampaign();
        if (defaultCampaign) randomCampaigns.push(defaultCampaign);
      }

      const campaignStatus = {};
      for (const campaign of randomCampaigns) {
        campaignStatus[campaign.id] ||= await canCreateChore(
          campaign.id,
          "post"
        );

        if (campaignStatus[campaign.id])
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

const checkIfPostsChoreCompleted = async (postedCampaigns, endTime) => {
  try {
    for (const campaign of postedCampaigns) {
      let searchContentFn = null;
      switch (campaign.media_type) {
        case "twitter":
          searchContentFn = searchTweets;
      }

      if (searchContentFn) {
        const text = convert(campaign.content, {
          wordwrap: 130,
        });
        const postedUsers = await searchContentFn(
          text,
          moment(
            campaign.last_checked_date || campaign.start_time
          ).toISOString(),
          endTime
        );

        if (postedUsers.length) {
          // console.log("postedUsers", postedUsers.length, text);

          const holdersByWalletId = await getHoldersByWalletId(
            postedUsers.map((u) => u.username)
          );

          await updateMediaIds(postedUsers);
          const campaignImages = (campaign.image_urls || "")
            .split(",")
            .filter((x) => !!x);
          // console.log("holdersByWalletId", holdersByWalletId, campaignImages);
          for (const user of postedUsers) {
            if (
              holdersByWalletId[user.username] &&
              (await areImagesMatching(campaignImages, user))
            )
              await markChoreAsCompleted({
                walletId: holdersByWalletId[user.username],
                campaignDetailsId: campaign.id,
                linkToPost: user.postLink,
                mediaPostId: user.postId,
                createdAt: user.createdAt,
                choreType: "post",
                followLink: user.followLink,
              });
          }
        }
      }
    }
    logger.info("completed checkIfPostsChoreCompleted process");
  } catch (error) {
    logger.info(`error in checkIfPostsChoreCompleted process: ${error}`);
  }
};

const rule = new schedule.RecurrenceRule();
const [hours, minutes] = config.CREATE_POST_CHORES_AT;
rule.hour = hours;
rule.minute = minutes;

const initiateAlgorithm = async () => {
  const endTime = moment().subtract(10, "seconds").toISOString();
  await updateWallets(new Date(), 0, false);
  const postedCampaigns = await getPostedCampaigns();
  const campaigns = await getActiveCampaigns();

  await checkIfPostsChoreCompleted(postedCampaigns, endTime);
  await checkIfOtherChoresCompleted(postedCampaigns, endTime);
  await checkIfFollowComplete();

  await createPostChores(campaigns);
  await createOtherChores();
  await createFollowChores(campaigns);

  for (const campaign of postedCampaigns) {
    await updateLastCheckedDate(campaign.id, endTime);
  }
  await transferRewards();
};
schedule.scheduleJob(rule, async () => {
  logger.info("started chores process");
  await initiateAlgorithm();
});
initiateAlgorithm();
process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});
