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

  const query =
    process.env.NODE_ENV === "production"
      ? `
    SELECT DISTINCT
      tw.wallet_id
      FROM
          (
              SELECT DISTINCT
                  CASE
                      WHEN from_wallet = ? THEN to_wallet
                      ELSE from_wallet
                  END AS wallet_id
              FROM
                  token_transactions
              WHERE
                  created_at > ? AND token = 'nml'
          ) AS tw
      INNER JOIN
          holders h ON h.wallet_id = tw.wallet_id
      WHERE
          nml_balance > ? AND (1 = ? OR is_diamond = 1) AND h.wallet_id NOT IN (?)
      ORDER BY
          wallet_id DESC
      LIMIT ? OFFSET ?;
`
      : `SELECT DISTINCT
          tw.wallet_id
          FROM
              (
                  SELECT DISTINCT
                      CASE
                          WHEN from_wallet = ? THEN to_wallet
                          ELSE from_wallet
                      END AS wallet_id
                  FROM
                      token_transactions
                  WHERE
                      created_at > ? AND token = 'nml'
              ) AS tw
          INNER JOIN
              holders h ON h.wallet_id COLLATE utf8mb4_unicode_ci = tw.wallet_id COLLATE utf8mb4_unicode_ci
          WHERE
              nml_balance > ? AND (1 = ? OR is_diamond = 1) AND h.wallet_id NOT IN (?)
          ORDER BY
              wallet_id DESC
          LIMIT ? OFFSET ?;`;
  const spins = await runQueryAsync(query, [
    process.env.UNISWAP_NML_EXCHANGE_WALLET_ID,
    start,
    nextSpin.minWalletValue,
    nextSpin.isDiamond ? 0 : 1,
    config.WHEEL_BAN_WALLETS,
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
