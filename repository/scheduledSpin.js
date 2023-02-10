const { executeQueryAsync, runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

const updateLaunchDate = async (id) => {
  const dateFormatted = moment().format("YYYY-MM-DDTHH:mm:ss");
  const query = "update scheduled_spins set prev_launch_date = ? where id = ?;";
  return await runQueryAsync(query, [dateFormatted, id]);
};

const recentDailyLaunchAt = async () => {
  const query =
    "select * from scheduled_spins where type = 'daily' order by prev_launch_date desc limit 1;";
  const records = await executeQueryAsync(query);
  return records[0]?.prev_launch_date;
};

const getScheduledSpin = async (id) => {
  const query = "select * from scheduled_spins where id = ?;";
  const spins = await runQueryAsync(query, [id]);
  return spins[0];
};
module.exports = {
  getAllSpins,
  updateLaunchDate,
  recentDailyLaunchAt,
  getScheduledSpin,
};
