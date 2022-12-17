const { executeQueryAsync } = require("../utils/spinwheelUtil");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

const updateLaunchDate = async (id) => {
  const dateFormatted = moment().format();
  const query = "update scheduled_spins set prev_launch_date = ? where id = ?;";
  return await executeQueryAsync(query, [dateFormatted, id]);
};

const recentDailyLaunchAt = async () => {
  const query =
    "select * from scheduled_spins where type = 'daily' order by prev_launch_date desc limit 1;";
  const records = await executeQueryAsync(query);
  return records[0];
};
module.exports = {
  getAllSpins,
  updateLaunchDate,
  recentDailyLaunchAt,
};
