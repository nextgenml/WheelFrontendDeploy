const getBalance = async (contract, walletId) => {
  const balance = contract.methods.balanceOf(walletId);
  return await balance.call();
};
const maxSupply = async (contract) => {
  const maxSupply = contract.methods.totalSupply();
  return await maxSupply.call();
};
module.exports = {
  getBalance,
  maxSupply,
};
