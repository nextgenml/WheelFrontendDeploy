const { ImageAnnotatorClient } = require("@google-cloud/vision");
const path = require("path");

async function extractTextFromImage(imageFilePath) {
  // Set the path to your service account credentials JSON file
  const credentialsPath = "vision-api.json";

  // Instantiate the client with the credentials file
  const client = new ImageAnnotatorClient({ keyFilename: credentialsPath });

  // Read the image file as a buffer
  const [result] = await client.textDetection(imageFilePath);
  const detections = result.textAnnotations;

  console.log("Text:");
  detections.forEach((text) => {
    console.log(text.description);
  });
}

// Replace 'path/to/your/image.jpg' with the path to your image file
const imageFilePath = "unnamed1.png";
extractTextFromImage(imageFilePath).catch((err) => {
  console.error("Error:", err);
});
