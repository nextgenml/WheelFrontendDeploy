const fs = require("fs").promises;
const Web3 = require("web3");
const path = require("path");
const config = require("../config.js");
const logger = require("../logger");

const readFile = async (filename) => {
  const data = await fs.readFile(filename);
  return data.toString();
};

const getContract = async (contractAddress, contractAbi) => {
  w3 = new Web3(new Web3.providers.HttpProvider(config.WEB3_PROVIDER_URL));
  let _path = path.join(__dirname, "assets", contractAbi);

  const fileContent = await readFile(_path);
  return new w3.eth.Contract(JSON.parse(fileContent), contractAddress);
};

const binaryPull = async (contract, start, end, callback) => {
  try {
    console.log("start, end", start, end);
    if (start < end) {
      const result = await contract.getPastEvents("Transfer", {
        fromBlock: start,
        toBlock: end,
      });
      callback(result);
    }
  } catch (error) {
    console.log("error", error.message);
    const mid = Math.floor((start + end) / 2);
    await fetchWallets(contract, start, mid, callback);
    await fetchWallets(contract, mid + 1, end, callback);
  }
};

const pullWallets = async (contractAddress, contractAbi) => {
  const contract = await getContract(contractAddress, contractAbi);
  const latest = await w3.eth.getBlockNumber();
  const wallets = [];
  await binaryPull(contract, 0, latest, (events) => {
    count += events.length;
    console.log("count", count);
    wallets.push(events);
  });

  return wallets.flat();
};
module.exports = {
  pullWallets,
};
