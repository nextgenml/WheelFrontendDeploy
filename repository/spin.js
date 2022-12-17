const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
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

  const query =
    "select count(1) as count from spins where spin_day = ? and type = ?;";
  const records = await runQueryAsync(query, [spinDay, type]);
  return records[0].count + 1;
};

const createSpin = async (nextSpin) => {
  const spinDay = moment().format("YYYY-MM-DD");
  const query = `insert into spins (spin_no, type, spin_day, running, scheduled_spin_id) values(?, ?, ?, 1, ?);`;

  await runQueryAsync(query, [
    nextSpin.spinNo,
    nextSpin.type,
    spinDay,
    nextSpin.id,
  ]);

  const spin = `select * from spins where id = LAST_INSERT_ID();`;

  let users = await runQueryAsync(spin);

  return users[0];
};

const markSpinAsDone = async (id) => {
  const update = `update spins set running = 0 where id = ?;`;

  return await runQueryAsync(update, [id]);
};
module.exports = {
  isAnySpinStarting,
  toBeRunSpin,
  getSpinNo,
  createSpin,
  markSpinAsDone,
};
