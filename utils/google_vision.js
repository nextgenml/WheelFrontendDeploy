const { ImageAnnotatorClient } = require("@google-cloud/vision");
const path = require("path");

async function extractTextFromImage(imageFilePath) {
  // Set the path to your service account credentials JSON file
  const credentialsPath = "config/google_auth.json";

  // Instantiate the client with the credentials file
  const client = new ImageAnnotatorClient({ keyFilename: credentialsPath });

  // Read the image file as a buffer
  const [result] = await client.textDetection(imageFilePath);
  const detections = result.textAnnotations;

  return detections.map((d) => d.description).join(" ");
}

module.exports = {
  extractTextFromImage,
};
