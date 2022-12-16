const { getAllSpins } = require("../repository/scheduledSpin");
const moment = require("moment");

const nextSpinDetails = async () => {
  const spins = await getAllSpins();
  const nextSpins = [];

  spins.forEach((spin) => {
    switch (spin.frequency) {
      case "weekly":
        const [hours, minutes, seconds] = spin.run_at
          .split(":")
          .map((x) => parseInt(x));

        const dayInNeed = parseInt(spin.spin_day); // for Thursday
        const spinDayInstance = moment().isoWeekday(dayInNeed);
        spinDayInstance.hours(hours);
        spinDayInstance.minutes(minutes);
        spinDayInstance.seconds(seconds);

        const currDate = moment();
        // assuming that current spin already started and there is no other spin running at this time
        if (currDate.diff(spinDayInstance) > 0) {
          spinDayInstance.add(1, "weeks");
        }

        nextSpins.push({
          spinId: spin.id,
          nextSpinAt: spinDayInstance,
        });
    }
  });
  nextSpins.sort((a, b) => a.nextSpinAt.diff(b.nextSpinAt));
  console.log(nextSpins[0]);
  return nextSpins[0];
};

nextSpinDetails();
module.exports = {
  nextSpinDetails,
};
