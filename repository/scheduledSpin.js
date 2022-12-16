const { executeQueryAsync } = require("../utils/spinwheelUtil");

const getAllSpins = async () => {
  const query = "select * from scheduled_spins where is_active = 1;";
  return await executeQueryAsync(query);
};

module.exports = {
  getAllSpins,
};
