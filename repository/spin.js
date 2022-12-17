const { runQueryAsync } = require("../utils/spinwheelUtil");

const isAnySpinStarting = async (scheduled_spin_id) => {
  const query = "select 1 from spins where to_be_run = 1";
  const spins = await runQueryAsync(query, [scheduled_spin_id]);
  return spins.length > 0;
};

const toBeRunSpin = async () => {
  const query = "select * from spins where to_be_run = 1";
  const spins = await runQueryAsync(query, []);
  return spins[0];
};

module.exports = {
  isAnySpinStarting,
  toBeRunSpin,
};
