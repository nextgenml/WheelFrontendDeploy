const { getMediaActions } = require("../../constants/mediaActions");
const {
  getPrevOtherUserPostIds,
  otherUserPosts,
} = require("../../repository/chores");
const { getActiveHolders } = require("../../repository/holder");
const config = require("../../config.js");
const { createChore } = require("../../repository/chores");
const moment = require("moment");
const { shuffleArray } = require("../../utils");
const logger = require("../../logger");

const createOtherChores = async () => {
  try {
    const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

    for (const holder of holders) {
      const prevPostIds = await getPrevOtherUserPostIds(holder.wallet_id);
      console.log("prevPostIds", prevPostIds);
      const userPosts = await otherUserPosts([...prevPostIds, -1]);

      const noOfPosts = Math.min(config.NO_OF_POSTS_PER_DAY, userPosts.length);

      const randomPosts = shuffleArray(userPosts).slice(0, noOfPosts);

      for (const post of randomPosts) {
        const actions = getMediaActions(post.media_type);

        for (const action of actions) {
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
          });
        }
      }
    }
    logger.info("completed createOtherChores");
  } catch (error) {
    logger.error(`error in createOtherChores: ${error}`);
  }
};
createOtherChores();
module.exports = {
  createOtherChores,
};
