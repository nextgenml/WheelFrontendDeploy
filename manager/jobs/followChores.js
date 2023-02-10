const {
  nextFollowUsers,
  markFollowChoreAsCompleted,
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
const { followingUsers } = require("../../utils/mediaClients/twitter");

const createFollowChores = async (campaigns) => {
  try {
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    for (const holder of holders) {
      if (holder.twitter_id) {
        const nextFollows = await nextFollowUsers(holder.wallet_id, "twitter");

        const noOfPosts = Math.min(
          config.NO_OF_POSTS_PER_DAY,
          nextFollows.length
        );

        const randomFollows = shuffleArray(nextFollows).slice(0, noOfPosts);
        const activeCampaign = shuffleArray(campaigns)[0];
        for (const post of randomFollows) {
          if (activeCampaign) {
            await createChore({
              campaignDetailsId: activeCampaign.id,
              walletId: holder.wallet_id,
              mediaType: "twitter",
              choreType: "follow",
              validFrom: moment()
                .add(1, "days")
                .startOf("day")
                .format("YYYY-MM-DDTHH:mm:ss"),
              validTo: moment()
                .add(config.OTHER_CHORE_VALID_DAYS, "days")
                .endOf("day")
                .format("YYYY-MM-DDTHH:mm:ss"),
              value: activeCampaign.reward,
              follow_link: post.follow_link,
              follow_user: post.wallet_id,
            });
          }
        }
      }
    }
    logger.info("completed createFollowChores");
  } catch (error) {
    logger.error(`error in createFollowChores: ${error}`);
  }
};

const checkIfFollowComplete = async () => {
  const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

  for (const holder of holders) {
    if (holder.twitter_id) {
      const followings = await followingUsers(holder.twitter_id);

      const holdersByWalletId = await getHoldersByWalletId(
        followings.map((u) => u.username)
      );

      for (const user of followings) {
        await markFollowChoreAsCompleted({
          walletId: holder.wallet_id,
          followUser: holdersByWalletId[user.username],
        });
      }
    }
  }
};

// checkIfFollowComplete();
module.exports = {
  createFollowChores,
  checkIfFollowComplete,
};
