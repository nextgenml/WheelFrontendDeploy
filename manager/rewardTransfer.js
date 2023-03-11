const { Contract, Wallet, providers, constants, BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils.js");
const { markWinnerAsPaid } = require("../repository/spinwheel");
const tokenAbi = require("./tokenAbi.json");
const config = require("../config.js");
const logger = require("../logger");

//network provider goerli/mainnet
const providerETH = new providers.JsonRpcProvider(config.RPC_URL);
// admin/owner wallet
const signerETH = new Wallet(config.DEPLOYER_WALLET, providerETH);
const rewardContract = new Contract(config.REWARD_TOKEN, tokenAbi, signerETH);
// gas estimation for transaction
let { MaxUint256 } = constants;
function calculateGasMargin(value) {
  return +(
    (value * BigNumber.from(10000).add(BigNumber.from(1000))) /
    BigNumber.from(10000)
  ).toFixed(0);
  // return value;
}

const gasEstimationForAll = async (account, fn, data) => {
  if (account) {
    const estimateGas = await fn(...data, MaxUint256).catch(() => {
      return fn(...data);
    });
    return calculateGasMargin(estimateGas);
  }
};
const distributeReward = async (address, amount) => {
  try {
    let fn = rewardContract.estimateGas.transfer;
    let params = [address, parseUnits(amount.toString())];
    const tx = await rewardContract.transfer(...params, {
      gasLimit: gasEstimationForAll(address, fn, params),
    });
    await tx.wait();

    const receipt = await providerETH.getTransactionReceipt(tx.hash);
    if (receipt && receipt?.status) {
      return true;
    }
  } catch (ex) {
    logger.error(`exception while distributing reward: ${ex}`);
    return false;
  }
};

const processPrizes = async (winners, callback) => {
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
let addressArray = [
  "0x9F226175809BC145e2056c28FA2F39E249E862a7",
  "0xC69f509ca944EA69b5e2F4b93256a92426bDa752",
  "0x789e27433F9f0868B60b2aD6C53CdA52CD775F6e",
];
// "0x6102C87458e0a4fC23FdcA11d9Fc9a038470319E",
//  "0xBB227b144F787470CeE78648B043316f3D907e8e",
//  "0x4306cebc0028Ea9aD58Edb2c6e3e557e7515D960",
//  "0x603553CefF0E0cb3CfD8526bbf43058ECd366B12",
//  "0x93b0eB44711863A82518cEE91f56c8AA08Ba8676",
//  "0xb960990198857b4277c625B837d955283691f94b",
//  "0x248e62dA8c43b3b7E8e39D832c960fC3406b24BC",
//  "0x1a459aA81570a5911238cf04325575e1f6B3274E",
//  "0xf888060CaF4Ca24ce59c19f0210e99e844b425a0",
//  "0xc3385b9b89416C068B5F3fB7698ae0c15917C1b7",
//  "0x2199d2dD04B844Ac9D55fc5Fe8518Aab8555Ce67",
//  "0x144b29657922C69d31CB6F666B01055B988F1a20",
const startTransfer = async () => {
  logger.info("starting");
  for (let index = 0; index < addressArray.length; index++) {
    await distributeReward(addressArray[index], 0.01);
    logger.info("awaiting");
  }
};

startTransfer();
module.exports = { processPrizes };
