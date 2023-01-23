const csv = require("csv-parser");
const fs = require("fs");

const readContentsFromCsv = async (path) => {
  return new Promise((resolve) => {
    fs.createReadStream("data.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
      });
  });
};

module.exports = {
  readContentsFromCsv,
};
