const { parseDateTime } = require("../utils");
const moment = require("moment");

const getNextWeeklySpin = (spin) => {
  const [hours, minutes, seconds] = parseDateTime(spin.run_at);

  const dayInNeed = parseInt(spin.spin_day);
  const spinDayInstance = moment().isoWeekday(dayInNeed);

  spinDayInstance.hours(hours);
  spinDayInstance.minutes(minutes);
  spinDayInstance.seconds(seconds);

  const currDate = moment();
  // assuming that current spin already started and there is no other spin running at this time
  if (currDate.diff(spinDayInstance) > 0) {
    spinDayInstance.add(1, "weeks");
  }
  return spinDayInstance;
};

const getNextDailySpin = (spin) => {
  const [hours, minutes, seconds] = parseDateTime(spin.run_at);

  const nextSpinTime = moment();
  nextSpinTime.hours(hours);
  nextSpinTime.minutes(minutes);
  nextSpinTime.seconds(seconds);

  const currDate = moment();
  if (currDate.diff(nextSpinTime) > 0) {
    nextSpinTime.add(1, "day");
  }
  return nextSpinTime;
};

const getNextBiWeeklySpin = (spin) => {
  const [hours, minutes, seconds] = parseDateTime(spin.run_at);

  const [day1, day2] = parseDateTime(spin.spin_day);
  const nextSpinTime = moment();
  nextSpinTime.set("date", day1);
  nextSpinTime.hours(hours);
  nextSpinTime.minutes(minutes);
  nextSpinTime.seconds(seconds);

  const currDate = moment();

  if (currDate.diff(nextSpinTime) > 0) {
    nextSpinTime.day(day2);
  }
  if (currDate.diff(nextSpinTime) > 0) {
    nextSpinTime.day(day1);
    nextSpinTime.add(1, "month");
  }
  return nextSpinTime;
};

module.exports = {
  getNextWeeklySpin,
  getNextDailySpin,
  getNextBiWeeklySpin,
};
