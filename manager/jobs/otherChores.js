const { getMediaActions } = require("../../constants/mediaActions");
const {
  getPrevOtherUserPostIds,
  otherUserPosts,
  getMediaPostIds,
  markOtherChoreAsCompleted,
  getActiveChoresCount,
  getPrevChoreIds,
  getCampaignPost,
} = require("../../repository/chores");
const {
  getActiveHolders,
  getHoldersByWalletId,
  getNextUserForChore,
  isEligibleForChore,
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
const { convert } = require("html-to-text");

const { chatGptResponse } = require("../../utils/chatgpt");

const createOtherChores = async (campaigns) => {
  try {
    for (const campaign of campaigns) {
      const successCriteria =
        config.SUCCESS_FACTOR[campaign.success_factor.toUpperCase()];

      const actions = getMediaActions(campaign.media_type);

      for (const action of actions) {
        let noOfPosts = successCriteria[action.toUpperCase()];

        const noOfPostsDone = await getActiveChoresCount(campaign.id, action);
        noOfPosts -= noOfPostsDone;
        const skippedUsers = [-1];
        while (noOfPosts > 0) {
          const campaignPost = await getCampaignPost(campaign.id);

          if (!campaignPost) break;

          const nextUser = await getNextUserForChore(campaignPost.id);

          if (nextUser) {
            const isEligible = await isEligibleForChore(
              nextUser.wallet_id,
              action
            );
            if (isEligible) {
              let comments = "";

              if (action === "comment")
                comments = await generateComments(campaign.content);
              await createChore({
                campaignDetailsId: campaignPost.campaign_detail_id,
                walletId: nextUser.wallet_id,
                mediaType: campaignPost.media_type,
                choreType: action,
                validFrom: moment().add(1, "days").startOf("day").format(),
                validTo: moment()
                  .add(config.OTHER_CHORE_VALID_DAYS, "days")
                  .endOf("day")
                  .format(),
                value: config.COST_PER_CHORE,
                ref_chore_id: campaignPost.id,
                linkToPost: campaignPost.link_to_post,
                mediaPostId: campaignPost.media_post_id,
                commentSuggestions: comments,
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
    }
    logger.info("completed createOtherChores");
  } catch (error) {
    logger.error(`error in createOtherChores: ${error}`);
  }
  try {
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    const campaignStatus = {};

    for (const holder of holders) {
      const prevPostIds = await getPrevOtherUserPostIds(holder.wallet_id);
      // console.log("prevPostIds", prevPostIds);
      const userPosts = await otherUserPosts([...prevPostIds, -1]);
      // console.log("userPosts", userPosts);

      const noOfPosts = Math.min(config.NO_OF_POSTS_PER_DAY, userPosts.length);

      const randomPosts = shuffleArray(userPosts).slice(0, noOfPosts);

      for (const post of randomPosts) {
        const actions = getMediaActions(post.media_type);
        // console.log("post", post.id);

        for (const action of actions) {
          campaignStatus[`${post.campaign_detail_id}_${action}`] ||=
            await canCreateChore(post.campaign_detail_id, action);

          let comments = "";

          if (action === "comment")
            comments = await generateComments(campaign.content);
          if (campaignStatus[`${post.campaign_detail_id}_${action}`])
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
              commentSuggestions: comments,
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
            // console.log("media_post_id", row, searchContentFn);
            const mediaUsers = await searchContentFn(
              row.media_post_id,
              moment(
                campaign.last_checked_date || campaign.start_time
              ).toISOString(),
              endTime
            );

            if (mediaUsers.length) {
              const holdersByWalletId = await getHoldersByWalletId(
                mediaUsers.map((u) => u.username)
              );

              for (const user of mediaUsers) {
                await markOtherChoreAsCompleted({
                  walletId: holdersByWalletId[user.username],
                  campaignDetailsId: campaign.id,
                  createdAt:
                    user.createdAt || moment().subtract(1, "day").format(),
                  choreType: action,
                  mediaPostId: row.media_post_id,
                });
              }
            }
          }
        }
      }
    }
    logger.info("completed checkIfOtherChoresCompleted process");
  } catch (error) {
    logger.info(`error in checkIfOtherChoresCompleted process: ${error}`);
  }
};

const generateComments = async (content) => {
  const text = convert(campaign.content, {
    wordwrap: 130,
  });
  const comment1 = await chatGptResponse(
    `rewrite the sentence in 20 words - ${text}`
  );
  const comment2 = await chatGptResponse(
    `rewrite the sentence in 20 words - ${text}`
  );
  return `${comment1},${comment2}`;
};
// createOtherChores();
// checkIfOtherChoresCompleted();
module.exports = {
  createOtherChores,
  checkIfOtherChoresCompleted,
};
