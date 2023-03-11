const { parseDateTime } = require("../utils");
const moment = require("moment");
const seconds = 59;

const getNextWeeklySpin = (spin) => {
  const [hours, minutes] = parseDateTime(spin.run_at);

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
  const [hours, minutes] = parseDateTime(spin.run_at);

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
  const [hours, minutes] = parseDateTime(spin.run_at);

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

const getNextMonthlySpin = (spin) => {
  const [hours, minutes] = parseDateTime(spin.run_at);

  const day = parseInt(spin.spin_day);
  const nextSpinTime = moment();
  nextSpinTime.set("date", day);
  nextSpinTime.hours(hours);
  nextSpinTime.minutes(minutes);
  nextSpinTime.seconds(seconds);

  const currDate = moment();
  if (currDate.diff(nextSpinTime) > 0) {
    nextSpinTime.add(1, "month");
  }
  return nextSpinTime;
};

const getNextYearlySpin = (spin) => {
  const [hours, minutes] = parseDateTime(spin.run_at);

  const [day, month] = parseDateTime(spin.spin_day);
  const nextSpinTime = moment();
  nextSpinTime.set("date", day);
  nextSpinTime.set("month", month - 1);
  nextSpinTime.hours(hours);
  nextSpinTime.minutes(minutes);
  nextSpinTime.seconds(seconds);

  const currDate = moment();
  if (currDate.diff(nextSpinTime) > 0) {
    nextSpinTime.add(1, "year");
  }
  return nextSpinTime;
};

const getNextAdhocSpin = (spin) => {
  const [hours, minutes] = parseDateTime(spin.run_at);

  const [day, month, year] = parseDateTime(spin.spin_day);
  const nextSpinTime = moment();
  nextSpinTime.set("year", year);
  nextSpinTime.set("month", month - 1);
  nextSpinTime.set("date", day);

  nextSpinTime.hours(hours);
  nextSpinTime.minutes(minutes);
  nextSpinTime.seconds(seconds);

  const currDate = moment();
  if (currDate.diff(nextSpinTime) <= 0) {
    return nextSpinTime;
  }
};

module.exports = {
  getNextWeeklySpin,
  getNextDailySpin,
  getNextBiWeeklySpin,
  getNextMonthlySpin,
  getNextYearlySpin,
  getNextAdhocSpin,
};
