const { getActiveCampaigns } = require("../../repository/campaignDetails");
const { getActiveHolders } = require("../../repository/holder");
const config = require("../../config.js");
const {
  createChore,
  getPreviousCampaignIds,
} = require("../../repository/chores");
const moment = require("moment");
const { shuffleArray } = require("../../utils");
const logger = require("../../logger");
const schedule = require("node-schedule");

const createChores = async () => {
  const campaigns = await getActiveCampaigns();
  const holders = await getActiveHolders(config.MINIMUM_WALLET_BALANCE);

  for (const holder of holders) {
    const prevCampaignIds = await getPreviousCampaignIds(holder.wallet_id);

    const newCampaigns = campaigns.filter(
      (c) => !prevCampaignIds.includes(c.id)
    );

    const noOfPosts =
      config.NO_OF_POSTS_PER_DAY > newCampaigns.length
        ? newCampaigns.length
        : config.NO_OF_POSTS_PER_DAY;

    const randomCampaigns = shuffleArray(newCampaigns).slice(0, noOfPosts);

    for (const campaign of randomCampaigns) {
      await createChore({
        campaignDetailsId: campaign.id,
        walletId: holder.wallet_id,
        mediaType: campaign.media_type,
        choreType: "post",
        validFrom: moment().add(1, "days").startOf("day").format(),
        validTo: moment()
          .add(config.POST_CHORE_VALID_DAYS, "days")
          .endOf("day")
          .format(),
        value: config.COST_PER_CHORE,
      });
    }
  }
  logger.info("completed creating chores");
};

const rule = new schedule.RecurrenceRule();
const [hours, minutes] = config.CREATE_POST_CHORES_AT;
rule.hour = hours;
rule.minute = minutes;

schedule.scheduleJob(rule, createChores);

process.on("SIGINT", () => {
  console.log("closing");
  schedule.gracefulShutdown().then(() => process.exit(0));
});
