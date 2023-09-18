const tesseract = require("node-tesseract-ocr");

const config = {
  lang: "eng",
  oem: 1,
  psm: 7,
};

const getTextFromImage = async (imagePath) => {
  return await tesseract.recognize(imagePath, config);
};

module.exports = {
  getTextFromImage,
};
