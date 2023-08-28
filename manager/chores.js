const choresRepo = require("../repository/chores");
const holderRepo = require("../repository/holder");
const campaignRepo = require("../repository/campaign");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { roundTo2Decimals } = require("../utils");
const uuid = require("uuid");
const { NXML_BLOG_CAMPAIGN } = require("../constants");

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
const createSystemValidationChore = async (choreId) => {
  const chore = await choresRepo.getChoresById(choreId);

  const split = chore.target_post_link.split("/");
  const postId = split[split.length - 1];
  const startTime = moment();
  const endTime = moment(startTime).add(
    process.env.VALIDATE_CHORE_VALID_DAYS,
    "days"
  );
  await choresRepo.createChore({
    campaignDetailsId: chore.campaign_detail_id,
    walletId: process.env.VALIDATION_CHORE_PROGRAM_WALLET,
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
};
const createCompletedPostChore = async (
  detailsId,
  walletId,
  startTime,
  endTime,
  content,
  postLink
) => {
  const chore = await choresRepo.createChore({
    campaignDetailsId: detailsId,
    walletId,
    mediaType: "twitter",
    choreType: "post",
    validFrom: startTime,
    validTo: endTime,
    value: process.env.COST_PER_CHORE,
    content,
  });

  const split = postLink.split("/");
  const followLink = split.slice(0, split.length - 2).join("/");
  const postId = split[split.length - 1];

  await choresRepo.markChoreAsCompleted({
    linkToPost: postLink,
    mediaPostId: postId,
    followLink,
    createdAt: moment().subtract(1, "hour").format(DATE_TIME_FORMAT),
    id: chore[1].insertId,
    walletId: walletId,
    campaignDetailsId: detailsId,
    choreType: "post",
  });
};

const dashboardStats = async (mediaType, walletId) => {
  const [
    totalAssigned,
    totalCompleted,
    totalUnpaid,
    totalPaid,
    todayUnpaid,
    todayPaid,
    todayLost,
    todayMax,
    newTotal,
    newTotalCount,
    old,
    oldCount,
    like,
    likeCount,
    retweet,
    retweetCount,
    comment,
    commentCount,
    follow,
    followCount,
    validate,
    validateCount,
  ] = (
    await Promise.all([
      choresRepo.getTotalChoresAssigned(walletId),
      choresRepo.getTotalChoresCompleted(walletId),
      choresRepo.getTotalEarnings(walletId),
      choresRepo.getTodayEarnings(walletId),
      choresRepo.getTodayLost(walletId),
      choresRepo.getTodayTotal(walletId),
      choresRepo.getTodayChoresTotal(walletId, mediaType),
      choresRepo.getOldChoresTotal(walletId, mediaType),
      ...["like", "retweet", "comment", "follow", "validate"].map((chore) =>
        choresRepo.getTotalByChore(walletId, mediaType, chore)
      ),
    ])
  ).flat();

  return {
    totalAssigned,
    totalCompleted,
    totalUnpaid: roundTo2Decimals(totalUnpaid),
    totalPaid: roundTo2Decimals(totalPaid),
    todayUnpaid: roundTo2Decimals(todayUnpaid),
    todayPaid: roundTo2Decimals(todayPaid),
    todayLost: roundTo2Decimals(todayLost),
    todayMax: roundTo2Decimals(todayMax),
    newTotal: roundTo2Decimals(newTotal),
    newTotalCount,
    old: roundTo2Decimals(old),
    oldCount,
    like: roundTo2Decimals(like),
    likeCount,
    retweet: roundTo2Decimals(retweet),
    retweetCount,
    comment: roundTo2Decimals(comment),
    commentCount,
    follow: roundTo2Decimals(follow),
    followCount,
    validate: roundTo2Decimals(validate),
    validateCount,
  };
};

const createPostChoreForBlog = async (blog) => {
  let { insertId } = await campaignRepo.saveCampaign({
    client: "NexgenML",
    campaign_name: NXML_BLOG_CAMPAIGN,
    start_time: moment(),
    end_time: moment().add(3, "months"),
    success_factor: "best",
    wallet_id: process.env.ADMIN_WALLET,
    default: blog.prompt === "blog-customization" ? "false" : "true",
    reward: process.env.COST_PER_VALIDATION_CHORE,
    blogId: blog.id,
    is_recursive_algo: 1,
  });

  const details = await campaignRepo.saveCampaignDetails({
    content: blog.prompt,
    start_time: moment(),
    end_time: moment().add(3, "months"),
    campaign_id: insertId,
    content_type: "text",
    collection_id: uuid.v4(),
    media_type: "twitter",
    post_link: blog.twitterurl,
  });

  if (!blog.twitterurl) return;

  const split = blog.twitterurl.split("/");
  const followLink = split.slice(0, split.length - 2).join("/");
  const postId = split[split.length - 1];

  const chore = await choresRepo.createChore({
    campaignDetailsId: details[1].insertId,
    walletId: process.env.ADMIN_WALLET,
    mediaType: "twitter",
    choreType: "post",
    validFrom: moment().format(DATE_TIME_FORMAT),
    validTo: moment().add(3, "months").format(DATE_TIME_FORMAT),
    value: process.env.COST_PER_CHORE,
    content: blog.prompt,
  });

  await choresRepo.markChoreAsCompleted({
    linkToPost: blog.twitterurl,
    mediaPostId: postId,
    followLink,
    createdAt: moment().subtract(1, "hour").format(DATE_TIME_FORMAT),
    id: chore[1].insertId,
    walletId: process.env.ADMIN_WALLET,
    campaignDetailsId: details[1].insertId,
    choreType: "post",
  });
};
module.exports = {
  createValidationChore,
  createCompletedPostChore,
  dashboardStats,
  createSystemValidationChore,
  createPostChoreForBlog,
};
