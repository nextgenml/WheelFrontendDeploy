const {
  getActiveCampaigns,
  getPostedCampaigns,
  updateLastCheckedDate,
} = require("../../repository/campaignDetails");
const {
  getHoldersByWalletId,
  updateMediaIds,
  nextUserForPost,
  isEligibleForChore,
} = require("../../repository/holder");
const config = require("../../config.js");
const {
  createChore,
  markChoreAsCompleted,
  getActiveChoresCount,
} = require("../../repository/chores");
const moment = require("moment");
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
    for (const campaign of campaigns) {
      const successCriteria =
        config.SUCCESS_FACTOR[campaign.success_factor.toUpperCase()];
      let noOfPosts = successCriteria.POST;

      const noOfPostsDone = await getActiveChoresCount(campaign.id, "post");
      noOfPosts -= noOfPostsDone;
      const skippedUsers = [-1];
      while (noOfPosts > 0) {
        const nextUser = await nextUserForPost(campaign.id, skippedUsers);

        if (nextUser) {
          const isEligible = await isEligibleForChore(
            nextUser.wallet_id,
            "post"
          );
          if (isEligible) {
            await createChore({
              campaignDetailsId: campaign.id,
              walletId: nextUser.wallet_id,
              mediaType: campaign.media_type,
              choreType: "post",
              validFrom: moment()
                .add(1, "days")
                .startOf("day")
                .format("YYYY-MM-DDTHH:mm:ss"),
              validTo: moment()
                .add(config.POST_CHORE_VALID_DAYS, "days")
                .endOf("day")
                .format("YYYY-MM-DDTHH:mm:ss"),
              value: campaign.reward,
            });
            noOfPosts -= 1;
          } else {
            skippedUsers.push(nextUser.wallet_id);
          }
        } else {
          break;
        }
      }
    }
    logger.info("completed createPostChores process");
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
        console.log("postedUsers", postedUsers.length);

        if (postedUsers.length) {
          const holdersByWalletId = await getHoldersByWalletId(
            postedUsers.map((u) => u.username)
          );

          await updateMediaIds(postedUsers);
          const campaignImages = (campaign.image_urls || "")
            .split(",")
            .filter((x) => !!x);
          console.log("holdersByWalletId", holdersByWalletId, campaignImages);
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
  await createOtherChores(campaigns);
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
// initiateAlgorithm();
process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});
