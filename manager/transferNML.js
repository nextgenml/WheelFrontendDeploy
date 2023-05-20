const Web3 = require("web3");
const { getContract } = require("../script/pullTransfers");
const logger = require("../logger");
const web3 = new Web3(process.env.WEB3_PROVIDER_URL); // Replace with your own Infura project ID

// Set the sending and receiving addresses and the amount to transfer
const tokenAddress = process.env.NML_CONTRACT_ADDRESS; // Replace with the actual NML token address
const sendAddress = process.env.WHEEL_PUBLIC_WALLET_ID; // Replace with the actual sending address

// Create a new instance of the ERC20 contract
let erc20Contract = null;
getContract(tokenAddress, "nmlAbi.json").then(
  (contract) => (erc20Contract = contract)
);

const transferNML = async (receiveAddress, amount) => {
  return new Promise((resolve) => {
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
              resolve(false);
              logger.error(
                "Sender does not have enough NML tokens to transfer"
              );
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
                    resolve(true);
                    logger.error(`Transaction receipt: ${receipt}`);
                  })
                  .on("error", (error) => {
                    resolve(false);
                    logger.error(`Error sending transaction: ${error}`);
                  });
              });
          });
      });
  });
};

module.exports = {
  transferNML,
};
