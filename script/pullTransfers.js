const fs = require("fs").promises;
const Web3 = require("web3");
const path = require("path");
const config = require("../config/env.js");
const logger = require("../logger");

Number.prototype.toFixedSpecial = function (n) {
  var str = this.toFixed(n);
  if (str.indexOf("e+") === -1) return str;

  str = str
    .replace(".", "")
    .split("e+")
    .reduce(function (p, b) {
      return p + Array(b - p.length + 2).join(0);
    });

  if (n > 0) str += "." + Array(n + 1).join(0);

  return str;
};

const groupWallets = (events) => {
  const dic = {};
  for (const ev of events) {
    if (dic[ev.returnValues.to]) {
      dic[ev.returnValues.to] = (
        parseFloat(dic[ev.returnValues.to]) + parseFloat(ev.returnValues.value)
      ).toFixedSpecial(0);
    } else {
      dic[ev.returnValues.to] = parseFloat(
        ev.returnValues.value
      ).toFixedSpecial(0);
    }
  }
  return Object.keys(dic)
    .map((k) => [k, dic[k]])
    .sort((a, b) => b[1] - a[1]);
};

const readFile = async (filename) => {
  const data = await fs.readFile(filename);
  return data.toString();
};

const getContract = async (contractAddress, contractAbi) => {
  w3 = new Web3(new Web3.providers.HttpProvider(config.WEB3_PROVIDER_URL));
  const filePath = path.join(__dirname, "assets", contractAbi);

  const fileContent = await readFile(filePath);
  return new w3.eth.Contract(JSON.parse(fileContent), contractAddress);
};

const binaryPull = async (contract, start, end, promises, callback) => {
  try {
    console.log("start, end", start, end);

    if (start <= end) {
      const result = await contract.getPastEvents("Transfer", {
        fromBlock: start,
        toBlock: end,
      });
      // if (result.length) promises.push(callback(result));
      if (result.length) await callback(result);
    }
  } catch (error) {
    if (error.message.includes("query returned more than 10000 results")) {
      const mid = Math.floor((start + end) / 2);
      await binaryPull(contract, start, mid, promises, callback);
      await binaryPull(contract, mid + 1, end, promises, callback);
    } else {
      logger.error(`error while pulling from smart contract: ${error.message}`);
    }
  }
};

const pullWallets = async (token, callback) => {
  const contract = await getContract(token.contract_address, token.abi_file);
  const latest = await w3.eth.getBlockNumber();

  const promises = [];
  await binaryPull(
    contract,
    token.last_block_number,
    latest,
    promises,
    async (events) => {
      console.log("count", events.length);
      await callback(token, events);
    }
  );
  console.log("waiting for db updates", token.token);
  // await Promise.all(promises);
  console.log("db updates done");
  return latest;
};

module.exports = {
  pullWallets,
  getContract,
};
