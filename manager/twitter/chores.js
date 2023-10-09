const campaignsRepo = require("../../repository/twitter_campaigns");
const {
  getOtherUserChores,
  isChoreExists,
  createChore,
  isFirstChoreExists,
} = require("../../repository/twitter_chores");
const { generateRandomNumber } = require("../../utils");
const { chatGptResponse } = require("../../utils/chatgpt");

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

const levelChoresCount = (noOfUsers) => {
  const result = {};
  [1, 2, 3, 4, 5].forEach((level) => {
    result[`level_${level}_target`] = Math.pow(noOfUsers - 1, level);
  });
  return result;
};
module.exports = {
  computeChores,
};
