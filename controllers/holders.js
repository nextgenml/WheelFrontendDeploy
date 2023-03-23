const logger = require("../logger");
const holderRepo = require("../repository/holder");

const saveSocialLinks = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { facebookLink, mediumLink, linkedinLink, twitterLink } = req.body;

    if (!facebookLink || !mediumLink || !linkedinLink || !twitterLink)
      return res.status(400).send({ message: "Invalid request" });

    await holderRepo.saveSocialLinks(
      walletId,
      facebookLink,
      mediumLink,
      linkedinLink,
      twitterLink
    );
    return res.json({
      message: "Update successful",
    });
  } catch (error) {
    logger.info(`saveSocialLinks: ${error}`);
    return res.status(500).json({
      error,
    });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    const { walletId } = req.query;
    const holder = await holderRepo.getById(walletId);
    return res.json({
      facebookLink: holder.facebook_link,
      mediumLink: holder.medium_link,
      linkedinLink: holder.linkedin_link,
      twitterLink: holder.twitter_link,
    });
  } catch (error) {
    logger.info(`saveSocialLinks: ${error}`);
    return res.status(500).json({
      error,
    });
  }
};

module.exports = {
  saveSocialLinks,
  getSocialLinks,
};
