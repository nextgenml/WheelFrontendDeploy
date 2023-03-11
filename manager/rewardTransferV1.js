// import ethers.js
const ethers = require("ethers");
const config = require("../config");
// provider: Infura or Etherscan will be automatically chosen
let provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
// Sender private key:
// correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
let privateKey = config.DEPLOYER_WALLET;
// Create a wallet instance
let wallet = new ethers.Wallet(privateKey, provider);

const distributeReward = async (address, amount) => {
  try {
    // Receiver Address which receives Ether
    let receiverAddress = address;
    // Ether amount to send
    let amountInEther = amount;
    // Create a transaction object
    let tx = {
      to: receiverAddress,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(amountInEther),
    };
    // Send a transaction
    await wallet.sendTransaction(tx);

    return true;
  } catch (ex) {
    logger.error(`exception while distributing reward: ${ex}`);
    return false;
  }
};

const processPrizesV1 = async (winners, callback) => {
  // return;
  for (const item of winners) {
    logger.info(`transfer to ${item.walletId}, reward: ${item.prize}`);
    const success = await distributeReward(item.walletId, item.prize);
    if (success) {
      await callback(item.id);
      logger.info(`processPrizes reward distribution: completed: ${item.id}`);
    } else
      logger.error(
        `processPrizes reward distribution: failed for participant ${item.id}`
      );
  }
};
module.exports = { processPrizesV1 };
