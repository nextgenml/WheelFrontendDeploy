const { areTwoImagesSimilar } = require("../../utils/imageComparison");

const areImagesMatching = async (campaignImages, user) => {
  let matchingCount = 0;
  // console.log("campaignImages", campaignImages, user.imageUrls);
  for (const image of campaignImages) {
    for (const postImageUrl of user.imageUrls) {
      const matching = await areTwoImagesSimilar(image.content, postImageUrl);
      // console.log("matching", matching);
      if (matching) matchingCount += 1;
    }
  }
  return matchingCount == campaignImages.length;
};

module.exports = {
  areImagesMatching,
};
