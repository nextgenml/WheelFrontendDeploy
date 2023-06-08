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

const createNMLTransaction = async (wallet_id) => {
  const query = `insert into nml_token_transactions (wallet_id, created_at) values(?, now());`;

  return runQueryAsync(query, [wallet_id]);
};

const isSellingExists = async (walletId) => {
  const query = `select 1 from token_transactions where from_wallet = ? and token = 'nml'`;
  const results = await runQueryAsync(query, [walletId]);

  return results.length > 0;
};
module.exports = {
  isSellingExists,
  createTransaction,
  createNMLTransaction,
};
