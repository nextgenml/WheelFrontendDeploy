const { getMediaActions } = require("../../constants/mediaActions");
const {
  getMediaPostIds,
  markOtherChoreAsCompleted,
  getActiveChoresCount,
  getCampaignPost,
} = require("../../repository/chores");
const {
  getHoldersByWalletId,
  getNextUserForChore,
  isEligibleForChore,
} = require("../../repository/holder");

const { createChore } = require("../../repository/chores");
const moment = require("moment");
const logger = require("../../logger");
const { getTwitterActionFunc } = require("../../utils/mediaClients/twitter");

const { chatGptResponse } = require("../../utils/chatgpt");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const config = require("../../config/env");

const createOtherChores = async (campaigns, sourceChoreType, args = {}) => {
  try {
    for (const campaign of campaigns) {
      // console.log("campaign------", campaign);
      const successCriteria =
        config.SUCCESS_FACTOR[campaign.success_factor.toUpperCase()];

      const actions = getMediaActions(campaign.media_type);

      for (const action of actions) {
        let noOfPosts = successCriteria[action.toUpperCase()];
        const activeChoresCount = await getActiveChoresCount(
          campaign.id,
          action
        );

        noOfPosts -= activeChoresCount;
        const skippedUsers = [-1];
        const skippedCampaigns = [-1];
        console.log("noOfPosts", noOfPosts);
        while (noOfPosts > 0) {
          const campaignPost = await getCampaignPost(
            campaign.id,
            skippedCampaigns,
            sourceChoreType
          );
          if (!campaignPost) break;

          const nextUser = await getNextUserForChore(
            campaignPost.id,
            action,
            skippedUsers
          );

          console.log("nextUser", nextUser);
          if (nextUser) {
            const isEligible = await isEligibleForChore(
              nextUser.wallet_id,
              action
            );
            if (isEligible) {
              let comments = "";

              const startTime = moment();
              const endTime = moment(startTime).add(
                config.OTHER_CHORE_VALID_DAYS,
                "days"
              );
              await createChore({
                campaignDetailsId: campaignPost.campaign_detail_id,
                walletId: nextUser.wallet_id,
                mediaType: campaignPost.media_type,
                choreType: action,
                validFrom: startTime.format(DATE_TIME_FORMAT),
                validTo: endTime.format(DATE_TIME_FORMAT),
                value: campaign.reward,
                ref_chore_id: campaignPost.id,
                linkToPost: args["postLink"] || campaignPost.link_to_post,
                mediaPostId: args["mediaPostId"] || campaignPost.media_post_id,
                commentSuggestions: comments,
                content: args["content"] || campaign.content,
              });
              noOfPosts -= 1;
            } else {
              skippedUsers.push(nextUser.wallet_id);
            }
          } else {
            skippedCampaigns.push(campaignPost.id);
          }
        }
        // console.log("------------------");
      }
    }
    logger.info("completed createOtherChores");
  } catch (error) {
    logger.error(`error in createOtherChores: ${error}`);
  }
};

const checkIfOtherChoresCompleted = async (postedCampaigns, endTime) => {
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
            // console.log("checking for", action);
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
                    user.createdAt ||
                    moment().subtract(1, "day").format(DATE_TIME_FORMAT),
                  choreType: action,
                  mediaPostId: row.media_post_id,
                  linkToPost: user.postLink,
                });

                // console.log("is_recursive_algo", campaign, action);
                if (campaign.is_recursive_algo && action === "comment")
                  await createOtherChores(
                    [
                      {
                        ...campaign,
                        content: user.postContent,
                      },
                    ],
                    action,
                    { mediaPostId: user.postId }
                  );
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
  const text = content;
  const comment1 = await chatGptResponse(
    `rewrite the next sentence in 256 characters. ${text}`
  );
  console.log("comment1", comment1);
  const comment2 = await chatGptResponse(
    `rewrite the next sentence in 256 characters. ${text}`
  );
  console.log("comment2", comment2);
  return `${comment1}||${comment2}`;
};
// createOtherChores();
// checkIfOtherChoresCompleted();
module.exports = {
  createOtherChores,
  checkIfOtherChoresCompleted,
};
