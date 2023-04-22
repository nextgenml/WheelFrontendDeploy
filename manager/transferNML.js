const Web3 = require("web3");
const { getContract } = require("../script/pullTransfers");
const web3 = new Web3(WEB3_PROVIDER_URL); // Replace with your own Infura project ID

// Set the sending and receiving addresses and the amount to transfer
const tokenAddress = "0x3858daD8A5b3364BE56DE0566AB59e3D656c51F6"; // Replace with the actual NML token address
const receiveAddress = "0x0987654321098765432109876543210987654321"; // Replace with the actual receiving address
const amount = 100; // Replace with the actual amount of NML tokens to transfer

// Create a new instance of the ERC20 contract
let erc20Contract = null;
getContract(tokenAddress, "nmlAbi.json").then(
  (contract) => (erc20Contract = contract)
);

const transferNML = () => {
  // Get the decimal places of the token
  erc20Contract.methods
    .decimals()
    .call()
    .then((decimals) => {
      // Convert the amount to the token's base unit (i.e. smallest unit)
      const baseUnitAmount = web3.utils.toBN(amount * Math.pow(10, decimals));

      // Get the sender's balance of NML tokens
      erc20Contract.methods
        .balanceOf(sendAddress)
        .call()
        .then((balance) => {
          // Check if the sender has enough NML tokens to transfer
          if (baseUnitAmount.gt(web3.utils.toBN(balance))) {
            console.log("Sender does not have enough NML tokens to transfer");
            return;
          }

          // Create a new transaction object
          const txObj = {
            from: sendAddress,
            to: tokenAddress,
            data: erc20Contract.methods
              .transfer(receiveAddress, baseUnitAmount.toString())
              .encodeABI(),
          };

          // Sign and send the transaction
          web3.eth.accounts
            .signTransaction(txObj, process.env.DEPLOYER_WALLET)
            .then((signedTx) => {
              web3.eth
                .sendSignedTransaction(signedTx.rawTransaction)
                .on("receipt", (receipt) => {
                  console.log("Transaction receipt:", receipt);
                })
                .on("error", (error) => {
                  console.error("Error sending transaction:", error);
                });
            });
        });
    });
};

module.exports = {
  transferNML,
};
