const { default: axios } = require("axios");
const fetch = require("node-fetch");

function stringToDate(date_str) {
  let date = new Date();
  let date_str_arr = date_str.split("/");
  date.setDate(parseInt(date_str_arr[0]));
  date.setMonth(parseInt(date_str_arr[1]) - 1);
  date.setFullYear(parseInt(date_str_arr[2]));

  return date;
}
function dateToString(date) {
  let d = date.getDate();
  let d_str = d.toString();
  if (d < 9) {
    d_str = "0" + d.toString();
  }
  return `${d_str}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getFormattedHash(hash) {
  return hash.splice(0, 5) + "..." + hash.substr(hash.length - 5);
}

const parseDateTime = (time) => {
  return time.split(":").map((x) => parseInt(x));
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const generateRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};
const generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const intersectionOfArrays = (lists) => {
  var result = [];

  for (var i = 0; i < lists.length; i++) {
    var currentList = lists[i];
    for (var y = 0; y < currentList.length; y++) {
      var currentValue = currentList[y];
      if (result.indexOf(currentValue) === -1) {
        var existsInAll = true;
        for (var x = 0; x < lists.length; x++) {
          if (lists[x].indexOf(currentValue) === -1) {
            existsInAll = false;
            break;
          }
        }
        if (existsInAll) {
          result.push(currentValue);
        }
      }
    }
  }
  return result;
};

const isUrlValid = async (url) => {
  let result = false;
  // try {
  //   const res = await axios.get(url);
  //   if (res.status === 200) result = true;
  //   else {
  //     console.log("status", res.status);
  //   }
  // } catch (error) {
  //   console.log("error", url, error.message);
  // }
  // return result;

  try {
    const response = await fetch(url, { redirect: "manual" });

    if (response.status === 200) {
      result = true;
      console.log(`${url} is up and running.`);
    } else if (response.status === 302) {
      // Handle redirect manually
      const redirectUrl = response.headers.get("location");
      console.log(`Redirected to: ${redirectUrl}`);
      result = true;
    } else {
      console.log(`${url} is returning a status code of ${response.status}.`);
    }
  } catch (error) {
    console.log("error", url, error.message);
  }
  console.log("result", result);
  return result;
};

const roundTo2Decimals = (num) =>
  Math.round(num * process.env.ETH_VALUE * 10000) / 10000;

module.exports = {
  dateToString,
  stringToDate,
  getFormattedHash,
  parseDateTime,
  timer,
  generateRandomString,
  generateRandomNumber,
  shuffleArray,
  intersectionOfArrays,
  roundTo2Decimals,
  isUrlValid,
};
