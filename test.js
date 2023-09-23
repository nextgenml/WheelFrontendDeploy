// const fs = require("fs");
// const ExifParser = require("exif-parser");

// // Function to extract metadata from an image file
// function extractImageMetadata(filePath) {
//   const data = fs.readFileSync(filePath);
//   const parser = ExifParser.create(data);

//   const result = parser.parse();

//   console.log("result", result);
//   const creationDate =
//     result.tags["DateTimeOriginal"] || result.tags["CreateDate"];
//   const downloadDate = new Date(); // You can use the current date as the download date

//   return {
//     creationDate: creationDate ? new Date(creationDate * 1000) : null,
//     downloadDate,
//   };
// }

// // Usage example
// const imagePath = "s1.jpeg";
// const metadata = extractImageMetadata(imagePath);

// console.log("Creation Date:", metadata.creationDate);
// console.log("Download Date:", metadata.downloadDate);

// // const fs = require("fs");

// // // get creation time using fs.stat() method
// // fs.stat("1694949229700.jpeg", (error, stats) => {
// //   // in case of any error
// //   if (error) {
// //     console.log(error);
// //     return;
// //   }

// //   // else show creation time from stats object
// //   console.log("File created at: ", stats); // File created at:  2021-04-30T23:53:07.633Z
// // });

const fs = require("fs");
const ExifParser = require("exif-parser");

// Read the image file
const imageBuffer = fs.readFileSync("1.jpeg");

// Create an ExifParser instance and parse the image buffer
const exifParser = ExifParser.create(imageBuffer);
const exifData = exifParser.parse();

// Now, you can access the EXIF data
console.log("EXIF data:", exifData);
