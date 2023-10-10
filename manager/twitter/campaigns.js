const {
  getCampaignCompletedChores,
} = require("../../repository/twitter_campaigns");
const campaignsRepo = require("../../repository/twitter_campaigns");

const getCampaignStats = async (campaignId) => {
  const campaign = await campaignsRepo.getCampaignById(campaignId);
  const result = [];
  let level = 1;

  const completed = await getCampaignCompletedChores(campaignId);
  while (level <= campaign.no_of_levels) {
    const c = completed.filter((x) => x.level === level)[0];
    const a = campaign[`level_${level}_target`];

    result.push({
      level,
      completed: c?.count || 0,
      target: a || 0,
    });
    level += 1;
  }
  return result;
};

module.exports = {
  getCampaignStats,
};
