const { getMediaActions } = require("../../constants/mediaActions");
const {
  getPrevOtherUserPostIds,
  otherUserPosts,
  markChoreAsCompleted,
  getMediaPostIds,
} = require("../../repository/chores");
const {
  getActiveHolders,
  getHoldersByWalletId,
} = require("../../repository/holder");
const config = require("../../config.js");
const { createChore } = require("../../repository/chores");
const moment = require("moment");
const { shuffleArray } = require("../../utils");
const logger = require("../../logger");
const { getTwitterActionFunc } = require("../../utils/mediaClients/twitter");
const {
  getPostedCampaigns,
  canCreateChore,
} = require("../../repository/campaignDetails");

const createOtherChores = async () => {
  try {
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    for (const holder of holders) {
      const prevPostIds = await getPrevOtherUserPostIds(holder.wallet_id);
      // console.log("prevPostIds", prevPostIds);
      const userPosts = await otherUserPosts([...prevPostIds, -1]);

      const noOfPosts = Math.min(config.NO_OF_POSTS_PER_DAY, userPosts.length);

      const randomPosts = shuffleArray(userPosts).slice(0, noOfPosts);

      for (const post of randomPosts) {
        const actions = getMediaActions(post.media_type);
        // console.log("post", post.id);

        for (const action of actions) {
          if (await canCreateChore(campaign.id, action))
            await createChore({
              campaignDetailsId: post.campaign_detail_id,
              walletId: holder.wallet_id,
              mediaType: post.media_type,
              choreType: action,
              validFrom: moment().add(1, "days").startOf("day").format(),
              validTo: moment()
                .add(config.OTHER_CHORE_VALID_DAYS, "days")
                .endOf("day")
                .format(),
              value: config.COST_PER_CHORE,
              ref_chore_id: post.id,
              linkToPost: post.link_to_post,
              mediaPostId: post.media_post_id,
            });
        }
      }
    }
    logger.info("completed createOtherChores");
  } catch (error) {
    logger.error(`error in createOtherChores: ${error}`);
  }
};

const checkIfOtherChoresCompleted = async (postedCampaigns, endTime) => {
  // postedCampaigns = await getPostedCampaigns();
  // endTime = moment().subtract(10, "seconds").toISOString();

  try {
    for (const campaign of postedCampaigns) {
      const actions = getMediaActions(campaign.media_type);
      for (const action of actions) {
        let searchContentFn = null;

        switch (campaign.media_type) {
          case "twitter":
            searchContentFn = getTwitterActionFunc(action);
            break;
        }

        if (searchContentFn) {
          const mediaPostIds = await getMediaPostIds(campaign.id);

          for (const row of mediaPostIds) {
            // console.log("media_post_id", row);
            const mediaUsers = await searchContentFn(
              row.media_post_id,
              moment(
                campaign.last_checked_date || campaign.start_time
              ).toISOString(),
              endTime
            );
            // console.log(action, mediaUsers);
            if (mediaUsers.length) {
              const holdersByWalletId = await getHoldersByWalletId(
                mediaUsers.map((u) => u.username)
              );

              for (const user of mediaUsers) {
                await markChoreAsCompleted({
                  walletId: holdersByWalletId[user.username],
                  campaignDetailsId: campaign.id,
                  createdAt:
                    user.createdAt || moment().subtract(1, "day").format(),
                  choreType: action,
                });
              }
            }
          }
        }
      }
    }
    logger.info("completed checkIfPostsChoreCompleted process");
  } catch (error) {
    logger.info(`error in checkIfPostsChoreCompleted process: ${error}`);
  }
};

// createOtherChores();
// checkIfOtherChoresCompleted();
module.exports = {
  createOtherChores,
  checkIfOtherChoresCompleted,
};
