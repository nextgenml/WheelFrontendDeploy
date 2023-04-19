const choresRepo = require("../repository/chores");
const holderRepo = require("../repository/holder");
const campaignRepo = require("../repository/campaign");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const createValidationChore = async (choreId) => {
  const chore = await choresRepo.getChoresById(choreId);
  if (!["comment", "post"].includes(chore.chore_type)) return;

  const campaign = await campaignRepo.getCampaignByDetailsId(
    chore.campaign_detail_id
  );
  const skippedUsers = [chore.wallet_id];

  while (true) {
    const nextUser = await holderRepo.getNextUserForChore(
      choreId,
      "validate",
      skippedUsers
    );
    console.log("nextUser", nextUser, skippedUsers);

    if (nextUser) {
      const isEligible = await holderRepo.isEligibleForChore(
        nextUser.wallet_id,
        "validate"
      );

      const split = chore.target_post_link.split("/");
      const postId = split[split.length - 1];
      if (isEligible) {
        const startTime = moment();
        const endTime = moment(startTime).add(
          process.env.VALIDATE_CHORE_VALID_DAYS,
          "days"
        );
        await choresRepo.createChore({
          campaignDetailsId: chore.campaign_detail_id,
          walletId: nextUser.wallet_id,
          mediaType: chore.media_type,
          choreType: "validate",
          validFrom: startTime.format(DATE_TIME_FORMAT),
          validTo: endTime.format(DATE_TIME_FORMAT),
          value: campaign.reward,
          ref_chore_id: chore.id,
          linkToPost: chore.target_post_link,
          mediaPostId: postId,
          content: chore.target_post || chore.content,
        });
        break;
      } else {
        skippedUsers.push(nextUser.wallet_id);
      }
    } else {
      break;
    }
  }
};

module.exports = {
  createValidationChore,
};
