const { getContract } = require("./pullTransfers");

const getBalance = async (contract, walletId) => {
  const balance = contract.methods.balanceOf(walletId);
  return { walletId: walletId, balance: await balance.call() };
};
const getBalances = async (contract, walletIds) => {
  const promises = [];
  for (const walletId of walletIds) {
    promises.push(getBalance(contract, walletId));
  }
  return await Promise.all(promises);
};
const maxSupply = async (contract) => {
  const maxSupply = contract.methods.totalSupply();
  return await maxSupply.call();
};
const getMaxSupply = async (token) => {
  const contract = await getContract(token.contract_address, token.abi_file);
  const max = await maxSupply(contract);
  return {
    token: token.token,
    max,
  };
};
module.exports = {
  getBalances,
  maxSupply,
  getMaxSupply,
};
