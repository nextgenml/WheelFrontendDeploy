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
    const hashtags = getRandomHashtags(campaign.hash_tags);

    while (level <= campaign.no_of_levels) {
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
              content: getRandomPrompt(chore.content, hashtags),
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
            content: getRandomPrompt(campaign.content, hashtags),
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
          content: getRandomPrompt(campaign.content, hashtags),
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
    let tags = hashtags.split("\n");

    const index = generateRandomNumber(tags.length);
    result += tags[index];
    result += " ";

    tags.splice(index, 1);

    const index2 = generateRandomNumber(tags.length);
    result += tags[index2];
  }
  return result;
};

const getRandomPrompt = (content, hashtags) => {
  const prefixes = [
    "Rewrite",
    "Rewrite the concept with positivity",
    "Rewrite the concept with a viewpoint highlighting uniqueness",
    "Rewrite the concept in support",
  ];
  const index = generateRandomNumber(prefixes.length);
  const prefix = prefixes[index];
  return `${prefix} with less than 220 characters of content: ${content} and include hashtags: ${hashtags}. Do not include any special characters`;
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
      if (tweet && tweet.errors && tweet.errors.length)
        return [true, false, tweet.errors[0].detail];

      const { text } = tweet.data;
      if (text.toLowerCase().includes(chore.content.toLowerCase()))
        return [true, true, "Validated"];
      else
        return [false, false, "Tweet does not contain mandatory text provided"];
    } catch (error) {
      if (error.data.status === 429)
        return [
          true,
          false,
          "Network busy. We will validate the link later. You can continue with other tasks",
        ];
      return [false, false, error.message];
    }
  } else {
    return [false, "Invalid link posted"];
  }
};

const getUserCampaignStats = async (campaignId, walletId, campaigner) => {
  const campaign = await campaignsRepo.getCampaignById(campaignId);
  const result = [];
  let level = 1;

  const completed = await getChoreCampaignCompletedStats(
    campaignId,
    walletId,
    campaigner
  );
  const assigned = await getChoreCampaignAssignedStats(
    campaignId,
    walletId,
    campaigner
  );

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
