const { getAllSpins } = require("../repository/scheduledSpin");
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
  const nextSpins = [];

  spins.forEach((spin) => {
    let nextSpin = null;
    switch (spin.frequency) {
      case "daily":
        nextSpin = getNextDailySpin(spin);
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
        spinId: spin.id,
        nextSpinAt: nextSpin,
      });
    }
  });
  nextSpins.sort((a, b) => a.nextSpinAt.diff(b.nextSpinAt));
  console.log(nextSpins);
  console.log("result", nextSpins[0]);
  return nextSpins[0];
};

nextSpinDetails();
module.exports = {
  nextSpinDetails,
};
