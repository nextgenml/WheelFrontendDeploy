const { getAllSpins } = require("../repository/scheduledSpin");
const {
  getNextWeeklySpin,
  getNextDailySpin,
  getNextBiWeeklySpin,
} = require("./spinTypes");

const nextSpinDetails = async () => {
  const spins = await getAllSpins();
  const nextSpins = [];

  spins.forEach((spin) => {
    let nextSpin = null;
    switch (spin.frequency) {
      case "weekly":
        nextSpin = getNextWeeklySpin(spin);
        break;
      case "daily":
        nextSpin = getNextDailySpin(spin);
        break;
      case "biweekly":
        nextSpin = getNextBiWeeklySpin(spin);
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
