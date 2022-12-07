const fs = require('fs').promises
const Web3 = require('web3');

//RESET INSTRUCTIONS:
//Put 0 to last_block_number.json and then run to filter the blocks from begining of the contract

let w3, CONTRACT
// Switch Mainnet/Testnet
let CHAINID = 5  //1 for Ethereum mainnet & 5 for Goerli testnet
let TESTURL = "https://eth-goerli.g.alchemy.com/v2/surwT5Ql_QhEc083ru_C98XrwbDj-jVx"
let CONTRACT_ADDRESS = "0x60F2CE0a06E1974a1378322B948567673f6eBF89"
// Script Wallet Address Details
let PRIVKEY = "4349749f97226605564c20fa6b9f35f259456a710ce23ca01bffe239cab3ae5f"
let WALLETADDRESS = "0x04c63D8c2fc9DD602aeE46F12083af1DdE69C713"

async function readFiles(filename) {
    const data = await fs.readFile(filename)
    return data.toString()
}

async function run_me(CONTRACT) {
    // Initializing web3
    w3 = new Web3(new Web3.providers.HttpProvider(TESTURL))
    // Initializing Contract
    return readFiles('./assets/abi.json').then((data) => {
        CONTRACT = new w3.eth.Contract(JSON.parse(data), CONTRACT_ADDRESS)
        return CONTRACT
    })
}

function fill_Dict(ev, dic) {
    if (dic[ev.returnValues.to] !== undefined) {
        dic[ev.returnValues.to] = (parseFloat(dic[ev.returnValues.to]) + parseFloat(ev.returnValues.value)).toFixedSpecial(0)
    } else {
        dic[ev.returnValues.to] = parseFloat(ev.returnValues.value).toFixedSpecial(0)
    }
}

function sortObj(obj) {
    // Sort object as list based on values
    return Object.keys(obj).map(k => ([k, obj[k]])).sort((a, b) => (b[1] - a[1]))
}

async function finalWorks(dic, lst) {
    let finalLST = []
    // Filling the sorted wallet address to a final list
    for (var i = 0; i < 25; i++) {
        if (dic[i]) {
            finalLST.push(dic[i][0])
        } else {
            break
        }
    }

    // Updating the LAST BLOCK NUMBER to the JSON file
    await fs.writeFile("./assets/last_block_number.json", (lst).toString(), (err) => {
        if (err)
            console.log("ERR")
    });

    return finalLST
}

async function fetch_my_events(CONTRACT, LAST_BLOCK, DICT) {

    let LAST = LAST_BLOCK
    let ev = null
    let error = null

    try {
        await CONTRACT.getPastEvents('Transfer', {
            fromBlock: LAST_BLOCK + 1,
            toBlock: 'latest'
        }, function (errors, events) {
            ev = events;
        })
    } catch (e) {
        error = e
        console.log("Something went wrong")
    }

    if (error == null) {

        // Checking event if its not 0 then update the LAST BLOCK NUMBER
        for (var i = 0; i < ev.length; i++) {

            // Filling up the dict with wallet address and nos of tokens  
            fill_Dict(ev[i], DICT)
            LAST = ev[i].blockNumber

        }

        // Sorting all and filtering 25 our
        DICT = sortObj(DICT)

        return await finalWorks(DICT, LAST)

    } else {
        console.log("Something went wrong")
        return {}
    }

}

// Run THIS
async function fetchAddress() {
    return await run_me(CONTRACT).then(async (CONTRACT) => {
        return await readFiles('./assets/last_block_number.json').then(async (LAST_BLOCK) => {
            return await fetch_my_events(CONTRACT, LAST_BLOCK, {}).then(async (final) => {
                return final
            })
        })
    })
}

// run it directly
// setTimeout(async () => {
//     await fetchAddress().then(console.log)
// }, 1000)

// fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
//     if (err) return console.log(err);
//     console.log(JSON.stringify(file));
//     console.log('writing to ' + fileName);
//   });


module.exports = fetchAddress

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