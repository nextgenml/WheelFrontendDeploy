const schedule = require("node-schedule");
const {
  getIncompleteReferrals,
  updateSuccessCriteria,
} = require("../../repository/referrals");
const { referralMet } = require("../blogs");

const initiateProcess = async () => {
  const referrals = await getIncompleteReferrals();
  for (const ref of referrals) {
    const isMet = await referralMet(ref.referee_twitter, ref.referred_at);

    console.log("isMet", isMet);
    if (isMet.met) {
      await updateSuccessCriteria(ref.id, process.env.MINIMUM_BLOGS_PER_DAY);
    }
  }
};
initiateProcess();
schedule.scheduleJob("0 */3 * * *", async () => {
  await initiateProcess();
});
