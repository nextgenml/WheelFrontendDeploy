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

const getSpinNo = async (type) => {
  const spinDay = moment().format("YYYY-MM-DD");

  const query = "select count(1) from spins where spin_day = ? and type = ?;";
  const records = await runQueryAsync(query, [spinDay, type]);
  return (records[0] || 0) + 1;
};

const createSpin = async (nextSpin) => {
  const spinDay = moment().format("YYYY-MM-DD");
  const query = `insert into spins (spin_no, type, spin_day, running, scheduled_spin_id) values(?, ?, ?, 1, ?);`;

  return await runQueryAsync(query, [
    nextSpin.spinNo,
    nextSpin.type,
    spinDay,
    nextSpin.id,
  ]);
};
module.exports = {
  isAnySpinStarting,
  toBeRunSpin,
  getSpinNo,
  createSpin,
};
