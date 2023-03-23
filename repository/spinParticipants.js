const { runQueryAsync } = require("../utils/spinwheelUtil");

const lastSpinAt = async () => {
  const query = `select spin_at from participants order by spin_at desc limit 1;`;
  const results = await runQueryAsync(query, []);
  return results[0].spin_at;
};
module.exports = {
  lastSpinAt,
};
