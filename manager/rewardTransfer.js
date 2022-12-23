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
const signerETH = new Wallet(
  "f27d03d6b006c9f6fac2cd86e0cad1d61cbb62442056a98f895d81e48cc7c9b1",
  providerETH
);
const rewardContract = new Contract(
  "0x4bb4954fc47ce04b62f3493040ff8318e4a72981",
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
    console.error("exception while distributing reward", ex);
    return false;
  }
};

const processPrizes = async (winners) => {
  for (const item of winners) {
    console.log("transfer to ", item.walletId, " reward: ", item.prize);
    const success = await distributeReward(item.walletId, item.prize);
    if (success) {
      await markWinnerAsPaid(item.id);
      console.log("processPrizes reward distribution: completed", item.id);
    } else
      console.log(
        `processPrizes reward distribution: failed for participant ${item.id}`
      );
  }
};
// let addressArray = [
//   "0xfeC714277eCcd686bDBd9A49e2877bAc2C532168",
//   "0x4b8760C3E41a9CCC9d283586dF00e4e25FC6cCe5",
//   "0x69CB26CD741AAe7Ad48aE57835448E5DE2dD77d6",
// ];

// const startTransfer = async () => {
//   console.log("starting");
//   for (let index = 0; index < addressArray.length; index++) {
//     await distributeReward(addressArray[index], 1);
//     console.log("awaiting");
//   }
// };

// startTransfer();
module.exports = { processPrizes };
