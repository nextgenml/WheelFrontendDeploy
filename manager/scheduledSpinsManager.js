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
  let nextSpins = [];
  let spin_no = 1;

  spins.forEach((spin) => {
    let nextSpin = null;
    switch (spin.frequency) {
      case "daily":
        spin_no = parseInt(spin.spin_day);
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
        id: spin.id,
        nextSpinAt: nextSpin,
        type: spin.frequency,
        spin_no,
      });
    }
  });
  nextSpins.sort((a, b) => a.nextSpinAt.diff(b.nextSpinAt));
  // console.log(nextSpins);
  // console.log("result", nextSpins[0]);
  return nextSpins[0];
};

nextSpinDetails();
module.exports = {
  nextSpinDetails,
};
