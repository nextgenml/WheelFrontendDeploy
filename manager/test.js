const Web3 = require("web3");
const tokenAbi = require("../script/assets/nmlAbi.json"); // Replace with your token's ABI

// Create a new Web3 instance connected to the Ethereum network
const web3 = new Web3(process.env.WEB3_PROVIDER_URL);

// Set the sender's private key and the contract address
const senderPrivateKey = process.env.WHEEL_NML_PRIVATE_WALLET_KEY;
const contractAddress = process.env.NML_CONTRACT_ADDRESS;

// Create an instance of the token contract
const tokenContract = new web3.eth.Contract(tokenAbi, contractAddress);

// Function to transfer tokens
async function transferNMLTokens(toWallet, amount) {
  try {
    console.log("transfer initiated");
    // Get the sender's account
    const senderAccount =
      web3.eth.accounts.privateKeyToAccount(senderPrivateKey);

    // Get the sender's nonce
    const nonce = await web3.eth.getTransactionCount(senderAccount.address);

    console.log("nonce", nonce);
    // Build the transaction data
    const data = tokenContract.methods.transfer(toWallet, amount).encodeABI();
    console.log("data", data);
    let gasPrice = await web3.eth.getGasPrice();
    gasPrice = parseInt(gasPrice) + parseInt(web3.utils.toWei("1", "gwei"));

    // Build the transaction object
    const txObject = {
      from: senderAccount.address,
      to: contractAddress,
      data: data,
      gas: 200000, // Adjust the gas limit as needed
      gasPrice: gasPrice.toString(), // Adjust the gas price as needed
      nonce: nonce,
    };

    console.log("txObject", txObject);
    // Sign the transaction
    const signedTx = await senderAccount.signTransaction(txObject);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    console.log("Transaction hash:", receipt.transactionHash);
    console.log("Transfer successful!");
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}

// Call the transferTokens function
transferNMLTokens("0xfeC714277eCcd686bDBd9A49e2877bAc2C532168", 100000);
