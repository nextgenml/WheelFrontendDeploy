const csv = require("csv-parser");
const fs = require("fs");

const readContentsFromCsv = async (path) => {
  const results = [];
  return new Promise((resolve) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(results);
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
