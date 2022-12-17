const {
  getAllSpins,
  recentDailyLaunchAt,
} = require("../repository/scheduledSpin");
const { getSpinNo } = require("../repository/spin");
const {
  getNextWeeklySpin,
  getNextDailySpin,
  getNextBiWeeklySpin,
  getNextMonthlySpin,
  getNextYearlySpin,
  getNextAdhocSpin,
} = require("./spinTypes");
const moment = require("moment");
const nextSpinDetails = async () => {
  const spins = await getAllSpins();
  let nextSpins = [];

  for (const spin of spins) {
    let nextSpin = null;
    prevLaunchAt = spin.prevLaunchAt || moment("2022-12-12");
    switch (spin.type) {
      case "daily":
        nextSpin = getNextDailySpin(spin);
        prevLaunchAt = (await recentDailyLaunchAt()) || moment("2022-12-12");
        break;
      case "weekly":
        nextSpin = getNextWeeklySpin(spin);
        break;
      case "biweekly":
        nextSpin = getNextBiWeeklySpin(spin);
        break;
      case "monthly":
        nextSpin = getNextMonthlySpin(spin);
        break;
      case "yearly":
        nextSpin = getNextYearlySpin(spin);
        break;
      case "adhoc":
        nextSpin = getNextAdhocSpin(spin);
        break;
    }
    const spinNo = await getSpinNo(spin.type);
    if (nextSpin) {
      nextSpins.push({
        id: spin.id,
        nextSpinAt: nextSpin,
        type: spin.type,
        prevLaunchAt,
        winnerPrizes: spin.winner_prizes.split(",").map((x) => parseInt(x)),
        spinDelay: spin.spin_delay,
        minWalletValue: spin.min_wallet_amount,
        spinNo,
      });
    }
  }

  nextSpins.sort((a, b) => a.nextSpinAt.diff(b.nextSpinAt));
  // console.log(nextSpins);
  // console.log("result", nextSpins[0]);
  return nextSpins[0];
};

nextSpinDetails();
module.exports = {
  nextSpinDetails,
};
