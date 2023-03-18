const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");

const createWallet = async (walletId, value, token) => {
  const query = `insert into wallets (wallet_id, value, created_at, token) values(?, ?, now(), ?);`;

  return await runQueryAsync(query, [walletId, value, token]);
};

const currSpinParticipants = async (offset, size, nextSpin) => {
  if (nextSpin.type === "adhoc")
    return nextSpin.participants.map((p) => ({ walletId: p }));

  const start = moment(nextSpin.prevLaunchAt).format(DATE_TIME_FORMAT);
  const query = `select wallet_id, sum(value) as total_value from wallets where created_at > ? and value >= ? group by wallet_id order by 2 desc limit ? OFFSET ?;`;

  const spins = await runQueryAsync(query, [
    start,
    nextSpin.minWalletValue,
    size,
    offset,
  ]);
  return spins.map((spin) => {
    return {
      walletId: spin.wallet_id,
      value: spin.total_value,
    };
  });
};

module.exports = {
  createWallet,
  currSpinParticipants,
};
