const schedule = require("node-schedule");
const {
  getIncompleteReferrals,
  updateSuccessCriteria,
} = require("../../repository/referrals");
const { referralMet } = require("../blogs");
const { createPayment } = require("../../repository/payments");
const holderRepo = require("../../repository/holder");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");

const initiateProcess = async () => {
  const referrals = await getIncompleteReferrals();
  for (const ref of referrals) {
    const isMet = await referralMet(ref.referee_twitter, ref.referred_at);

    console.log("is Referral Met", isMet);
    if (isMet.met) {
      await updateSuccessCriteria(ref.id, process.env.MINIMUM_BLOGS_PER_DAY);
      const today = moment().startOf("day").format(DATE_TIME_FORMAT);
      const date = today.split(" ")[0];
      await createPayment(ref.referer, {
        type: "referral",
        is_paid: 0,
        amount: process.env.REFERRAL_PRIZE,
        earned_at: date,
      });
    }
  }
};
// initiateProcess();
// schedule.scheduleJob("0 */1 * * *", async () => {
//   await initiateProcess();
// });
