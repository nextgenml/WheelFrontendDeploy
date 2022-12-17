const {
  getAllSpins,
  recentDailyLaunchAt,
} = require("../repository/scheduledSpin");
const {
  getNextWeeklySpin,
  getNextDailySpin,
  getNextBiWeeklySpin,
  getNextMonthlySpin,
  getNextYearlySpin,
  getNextAdhocSpin,
} = require("./spinTypes");

const nextSpinDetails = async () => {
  const spins = await getAllSpins();
  let nextSpins = [];

  for (const spin of spins) {
    let nextSpin = null;
    let spin_no = 1;
    prevLaunchAt = spin.prevLaunchAt || moment("2022-12-12");
    switch (spin.frequency) {
      case "daily":
        spin_no = parseInt(spin.spin_day);
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
    if (nextSpin) {
      nextSpins.push({
        id: spin.id,
        nextSpinAt: nextSpin,
        type: spin.frequency,
        prevLaunchAt,
        winnerPrizes: spin.winner_prizes.split(",").map((x) => parseInt(x)),
        spinDelay: spin.spin_delay,
        minWalletValue: spin.min_wallet_amount,
        spin_no,
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
