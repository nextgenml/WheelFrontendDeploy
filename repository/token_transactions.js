const { runQueryAsync } = require("../utils/spinwheelUtil");

const createTransaction = async (data, value, token) => {
  const query = `insert into token_transactions (address, block_number, from_wallet, to_wallet, value, transaction_hash, token, created_at) values(?, ?, ?, ?, ?, ?, ?, now());`;

  return runQueryAsync(query, [
    data.address,
    data.blockNumber,
    data.returnValues.from,
    data.returnValues.to,
    value,
    data.transactionHash,
    token,
  ]);
};

module.exports = {
  createTransaction,
};
