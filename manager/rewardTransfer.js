const { Contract, Wallet, providers, constants, BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils.js");
const { markWinnerAsPaid } = require("../repository/spinwheel");
const tokenAbi = require("./tokenAbi.json");

//network provider goreli/mainnet
const providerETH = new providers.JsonRpcProvider(
  //goreli RPC URL
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  //mainnet RPC URL
  //   "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);
// admin/owner wallet
const signerETH = new Wallet(process.env.ADMIN_KEY, providerETH);
const rewardContract = new Contract(
  process.env.REWARD_TOKEN,
  tokenAbi,
  signerETH
);

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
const distributeReward = async (address, amount, id) => {
  let fn = rewardContract.estimateGas.transfer;
  let params = [address, parseUnits(amount.toString())];
  const tx = await rewardContract.transfer(...params, {
    gasLimit: gasEstimationForAll(address, fn, params),
  });
  console.log(tx, "tx");
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await providerETH.getTransactionReceipt(tx.hash);
      if (receipt?.status) {
        await markWinnerAsPaid(id);
      } else {
        distributeReward(address, amount);
      }
    } catch (error) {
      console.log(error);
      break;
    }
  }
};
module.exports = { distributeReward };
