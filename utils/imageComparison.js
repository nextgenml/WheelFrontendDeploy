const looksSame = require("looks-same");
const fs = require("fs");
const Axios = require("axios");
const path = require("path");

const areTwoImagesSimilar = async (image1Path, image2Url) => {
  const image2Path = path.join(__dirname, "../", "tmp/images/tmp.jpeg");
  await downloadImage(image2Url, image2Path);

  image1Path = path.join(__dirname, "../", `uploads/${image1Path}`);
  const { equal } = await looksSame(image1Path, image2Path);

  fs.unlink(image2Path, () => {
    // console.log("deleted file");
  });
  // console.log("equal", equal);
  return equal;
};

async function downloadImage(url, filepath) {
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("error", reject)
      .once("close", () => resolve(filepath));
  });
}

// const check = async (x, y) => {
//   const data = await looksSame(x, y, {
//     tolerance: 50,
//     ignoreCaret: true,
//     ignoreAntialiasing: true,
//     antialiasingTolerance: true,
//   });

//   await looksSame.createDiff({
//     reference: x,
//     current: y,
//     diff: "tmp/images/tmp1.jpeg",
//     highlightColor: "#000000", // color to highlight the differences
//     strict: false, // strict comparsion
//     tolerance: 2.5,
//     antialiasingTolerance: 0,
//     ignoreAntialiasing: true, // ignore antialising by default
//     ignoreCaret: true, // ignore caret by default
//   });
//   console.log("equal", data);
// };
// check("uploads/1675950142593.jpeg", "tmp/images/tmp.jpeg");
module.exports = {
  areTwoImagesSimilar,
};
