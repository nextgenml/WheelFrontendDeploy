const logger = require("../logger");
const { validDomains, replaceTrailingSlash } = require("../manager/blogs");
const holderRepo = require("../repository/holder");

const saveSocialLinks = async (req, res) => {
  try {
    const { walletId } = req.query;
    const { facebookLink, mediumLink, linkedinLink, twitterLink } = req.body;

    const { valid, message } = validDomains(req.body);
    if (!valid) return res.status(400).send({ message });

    await holderRepo.saveSocialLinks(
      walletId,
      replaceTrailingSlash(facebookLink),
      replaceTrailingSlash(mediumLink),
      replaceTrailingSlash(linkedinLink),
      replaceTrailingSlash(twitterLink)
    );
    return res.json({
      message: "Update successful",
    });
  } catch (error) {
    logger.info(`saveSocialLinks: ${error}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    const { walletId } = req.query;
    const holder = await holderRepo.getById(walletId);
    return res.json({
      facebookLink: holder?.facebook_link || "",
      mediumLink: holder?.medium_link || "",
      linkedinLink: holder?.linkedin_link || "",
      twitterLink: holder?.twitter_link || "",
    });
  } catch (error) {
    logger.info(`saveSocialLinks: ${error}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  saveSocialLinks,
  getSocialLinks,
};
