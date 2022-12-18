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

module.exports = {
  dateToString,
  stringToDate,
  getFormattedHash,
  parseDateTime,
  timer,
};
