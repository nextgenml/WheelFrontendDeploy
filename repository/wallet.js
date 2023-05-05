const { runQueryAsync } = require("../utils/spinwheelUtil");
const moment = require("moment");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper");
const { getSpinById } = require("./scheduledSpin");

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
  const query = `with temp_wallets as (
    select distinct (case 
    when from_wallet = ? then to_wallet
    else from_wallet
    end) as wallet_id from token_transactions 
    where created_at > ? and token = 'nml'
    ), balance_wallets as (
    select distinct tw.wallet_id from temp_wallets tw 
    inner join holders h on h.wallet_id COLLATE utf8mb4_unicode_ci = tw.wallet_id COLLATE utf8mb4_unicode_ci
    where nml_balance > ?
    )
    select * from balance_wallets order by 1 desc limit ? offset ?;`;

  const spins = await runQueryAsync(query, [
    process.env.NML_CONTRACT_ADDRESS,
    start,
    nextSpin.minWalletValue,
    size,
    offset,
  ]);
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
