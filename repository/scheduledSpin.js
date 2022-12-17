const { executeQueryAsync } = require("../utils/spinwheelUtil");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

const updateLaunchDate = async (id, date) => {
  const dateFormatted = moment(date).format("YYYY-MM-DD HH:MM:SS");
  const query = "update scheduled_spins set prev_launch_date = ? where id = ?;";
  return await executeQueryAsync(query, [dateFormatted, id]);
};
const recentDailyLaunchAt = async () => {
  const query =
    "select * from scheduled_spins where frequency = 'daily' order by prev_launch_date limit 1;";
  const records = await executeQueryAsync(query);
  return records[0];
};
module.exports = {
  getAllSpins,
  updateLaunchDate,
  recentDailyLaunchAt,
};
