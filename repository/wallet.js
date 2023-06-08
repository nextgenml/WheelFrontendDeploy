const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { getSpinById } = require("./scheduledSpin");
const config = require("../config/env");

const createWallet = async (walletId, value, token) => {
  const query = `insert into wallets (wallet_id, value, created_at, token) values(?, ?, now(), ?);`;

  return await runQueryAsync(query, [walletId, value, token]);
};

const currSpinParticipants = async (offset, size, nextSpin) => {
  if (nextSpin.type === "adhoc") {
    const spin = await getSpinById(nextSpin.id);
    if (spin && spin.participants)
      return spin.participants.split(",").map((p) => ({ walletId: p }));
    else return nextSpin.participants.map((p) => ({ walletId: p }));
  }

  const start = moment(nextSpin.prevLaunchAt).format(DATE_TIME_FORMAT);

  const query = `select distinct h.wallet_id from nml_holders h inner join nml_token_transactions tt on tt.wallet_id = h.wallet_id where h.balance >= ? and (1 = ? OR is_diamond = 1) and tt.created_at >= ? and h.wallet_id not in (?) order by wallet_id limit ? offset ?`;
  const spins = await runQueryAsync(query, [
    nextSpin.minWalletValue,
    nextSpin.isDiamond ? 0 : 1,
    start,
    config.WHEEL_BAN_WALLETS,
    size,
    offset,
  ]);
  // console.log("offset", offset);
  return spins.map((spin) => {
    return {
      walletId: spin.wallet_id,
    };
  });
};

module.exports = {
  createWallet,
  currSpinParticipants,
};
