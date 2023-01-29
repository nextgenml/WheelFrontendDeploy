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

// areTwoImagesSimilar(
//   "client/public/images/Fljchf9XoAInXLD.jpeg",
//   "https://pbs.twimg.com/media/Fljchf9XoAInXLD.jpg"
// );
module.exports = {
  areTwoImagesSimilar,
};
