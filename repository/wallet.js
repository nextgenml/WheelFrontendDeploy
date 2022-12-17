const { runQueryAsync } = require("../utils/spinwheelUtil");

const createWallet = async (walletId, value) => {
  const query = `insert into wallets (wallet_id, value, created_at) values(?, ?, now());`;

  return await runQueryAsync(query, [walletId, value]);
};

const currSpinParticipants = async (start, minWalletValue) => {
  start = moment(start).startOf("day").format();
  const query = `select * from wallets where created_at > ? and value >= ?;`;

  const users = await runQueryAsync(query, [start, end, minWalletValue]);
  return users.map((user) => {
    return {
      id: user.id,
      day: moment(user.spin_day).format("YYYY-MM-DD"),
      spin: user.spin_no,
      walletId: formatTransactionId(user.wallet_id),
      rank: user.winning_rank,
    };
  });
};

module.exports = {
  createWallet,
  currSpinParticipants,
};
