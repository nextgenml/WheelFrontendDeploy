const { runQueryAsync } = require("../utils/spinwheelUtil");

const isAnySpinRunning = async (scheduled_spin_id) => {
  const query = "select 1 from spins where running = 1";
  const spins = await runQueryAsync(query, [scheduled_spin_id]);
  return spins.length > 0;
};

module.exports = {
  isAnySpinRunning,
};
