const { nextFollowUsers } = require("../../repository/chores");
const { getActiveHolders } = require("../../repository/holder");
const config = require("../../config.js");
const { createChore } = require("../../repository/chores");
const moment = require("moment");
const { shuffleArray } = require("../../utils");
const logger = require("../../logger");

const createFollowChores = async (activeCampaignId) => {
  try {
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    for (const holder of holders) {
      const nextFollows = await nextFollowUsers(holder.wallet_id, "twitter");

      const noOfPosts = Math.min(
        config.NO_OF_POSTS_PER_DAY,
        nextFollows.length
      );

      const randomFollows = shuffleArray(nextFollows).slice(0, noOfPosts);

      for (const post of randomFollows) {
        await createChore({
          campaignDetailsId: activeCampaignId,
          walletId: holder.wallet_id,
          mediaType: "twitter",
          choreType: "follow",
          validFrom: moment().add(1, "days").startOf("day").format(),
          validTo: moment()
            .add(config.OTHER_CHORE_VALID_DAYS, "days")
            .endOf("day")
            .format(),
          value: config.COST_PER_CHORE,
          follow_link: post.follow_link,
          follow_user: post.wallet_id,
        });
      }
    }
    logger.info("completed createFollowChores");
  } catch (error) {
    logger.error(`error in createFollowChores: ${error}`);
  }
};

const checkIfFollowComplete = async () => {};

createFollowChores();
module.exports = {
  createFollowChores,
};
