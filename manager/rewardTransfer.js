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
const distributeReward = async (address, amount, id) => {
  let fn = rewardContract.estimateGas.transfer;
  let params = [address, parseUnits(amount.toString())];
  const tx = await rewardContract.transfer(...params, {
    gasLimit: gasEstimationForAll(address, fn, params),
  });
  await tx.wait();
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await providerETH.getTransactionReceipt(tx.hash);
      if (receipt && receipt?.status) {
        console.log("its done");
        // await markWinnerAsPaid(id);
      } else if (receipt && !receipt?.status) {
        distributeReward(address, amount);
      }
    } catch (error) {
      console.log(error);
      break;
    }
  }
};
let addressArray = [
  //  "0xbE7a8FAaE8c37139496689Cd1906596E2D734743",
  //  "0x4fA11fD8b96807Bae89Dd1C3041b9fb058A3a347",
  //  "0x0030B1331Dce886e332Ac1f3ed17d3018C542114",
  "0xfeC714277eCcd686bDBd9A49e2877bAc2C532168",
  "0x4b8760C3E41a9CCC9d283586dF00e4e25FC6cCe5",
];

const startTransfer = async () => {
  for (let index = 0; index < addressArray.length; index++) {
    await distributeReward(addressArray[index], 1);
    console.log("awaiting");
  }
};

startTransfer();
module.exports = { distributeReward };
