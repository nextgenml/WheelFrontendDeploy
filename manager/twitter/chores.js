const campaignsRepo = require("../../repository/twitter_campaigns");
const {
  getOtherUserChores,
  isChoreExists,
  createChore,
  isFirstChoreExists,
  isLinkExists,
  getChoreById,
  getChoreCampaignCompletedStats,
  getChoreCampaignAssignedStats,
} = require("../../repository/twitter_chores");
const { generateRandomNumber } = require("../../utils");
const { chatGptResponse } = require("../../utils/chatgpt");
const { getTweetById } = require("../../utils/mediaClients/twitter");

const computeChores = async (walletId, campaignId) => {
  const campaigns = await campaignsRepo.getCampaignById(campaignId);

  for (const campaign of [campaigns]) {
    let level = 2;
    const hashtags = getRandomHashtags(campaign.hashtags);
    while (level <= campaign.no_of_users) {
      const otherUserChores = await getOtherUserChores(
        campaign.id,
        walletId,
        level - 1
      );
      for (const chore of otherUserChores) {
        const isExists = await isChoreExists(walletId, chore.id);

        if (!isExists) {
          const messages = [
            {
              role: "system",
              content: `Rewrite the content: ${chore.content} and include hashtags: ${hashtags}`,
            },
          ];
          const { content } = await chatGptResponse(messages);

          await createChore({
            walletId,
            refId: chore.id,
            type: "comment",
            content,
            tweetLink: chore.tweet_link,
            level,
            campaignId: campaign.id,
          });
        }
      }
      level += 1;
    }
    const isExists = await isFirstChoreExists(walletId, campaign.id);
    if (!isExists) {
      if (campaign.tweet_link) {
        const messages = [
          {
            role: "system",
            content: `Rewrite the content: ${campaign.content} and include hashtags: ${hashtags}`,
          },
        ];
        const { content } = await chatGptResponse(messages);

        await createChore({
          walletId,
          refId: -1,
          type: "comment",
          content,
          tweetLink: campaign.tweet_link,
          level: 1,
          campaignId: campaign.id,
        });
      } else {
        await createChore({
          walletId,
          refId: -1,
          type: "post",
          content: campaign.content + "\n" + hashtags,
          level: 1,
          campaignId: campaign.id,
        });
      }
    }
  }
};

const getRandomHashtags = (hashtags) => {
  let result = "";
  if (hashtags) {
    const tags = hashtags.split("\n");

    const index = generateRandomNumber(tags.length);
    result += hashtags[index];
    result += ", ";

    const index2 = generateRandomNumber(tags.length);
    result += hashtags[index2];
  }
  result;
};

const isValidLink = async (link, choreId) => {
  if (link && (link.includes("twitter.com") || link.includes("x.com"))) {
  } else return [false, false, "Invalid link submitted"];

  const isExists = await isLinkExists(link, choreId);

  if (isExists) return [false, false, "Post link already exists"];
  const split = link.split("/");
  const id_temp = split[split.length - 1];
  const id = id_temp.split("?")[0];

  if (parseInt(id) > 0) {
    try {
      const chore = await getChoreById(choreId);
      const tweet = await getTweetById(id);
      try {
        if (tweet && tweet.errors && tweet.errors.length)
          return [false, tweet.errors[0].detail];

        const { text } = tweet.data;
        if (text.toLowerCase().includes(chore.content.toLowerCase()))
          return [true, true, "Validated"];
        else
          return [
            false,
            false,
            "Tweet does not contain mandatory text provided",
          ];
      } catch (error) {
        return [
          true,
          false,
          "Network busy. We will validate the link later",
          error,
        ];
      }
    } catch (error) {}
  } else {
    return [false, "Invalid link posted"];
  }
};

const getUserCampaignStats = async (campaignId, walletId) => {
  const campaign = await campaignsRepo.getCampaignById(campaignId);
  const result = [];
  let level = 1;

  const completed = await getChoreCampaignCompletedStats(campaignId, walletId);
  const assigned = await getChoreCampaignAssignedStats(campaignId, walletId);

  while (level <= campaign.no_of_levels) {
    const c = completed.filter((x) => x.level === level)[0];
    const a = assigned.filter((x) => x.level === level)[0];

    result.push({
      level,
      completed: c?.count || 0,
      assigned: a?.count || 0,
    });
    level += 1;
  }
  return result;
};

module.exports = {
  computeChores,
  isValidLink,
  getUserCampaignStats,
};
