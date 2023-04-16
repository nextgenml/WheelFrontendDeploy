const logger = require("../logger");
const { validateAtHandles, replaceTrailingSlash } = require("../manager/blogs");
const holderRepo = require("../repository/holder");
const referralsRepo = require("../repository/referrals");

const saveSocialLinks = async (req, res) => {
  try {
    const { walletId } = req.query;
    const {
      facebookLink,
      mediumLink,
      linkedinLink,
      twitterLink,
      telegramLink,
      inviteCode,
    } = req.body;

    const { valid, message } = validateAtHandles(req.body);
    if (!valid) return res.status(400).send({ message });

    await holderRepo.saveSocialLinks(
      walletId,
      replaceTrailingSlash(facebookLink),
      replaceTrailingSlash(mediumLink),
      replaceTrailingSlash(linkedinLink),
      replaceTrailingSlash(twitterLink),
      replaceTrailingSlash(telegramLink)
    );
    if (inviteCode) {
      const holder = await holderRepo.getById(walletId);
      if (!holder.joined_invite_code) {
        await holderRepo.updateJoinedInviteCode(holder.id, inviteCode);
        const twitter = replaceTrailingSlash(twitterLink);
        const exists = await referralsRepo.checkReplica(twitter);
        if (!exists.length) {
          const referer = await holderRepo.getByInviteCode(inviteCode);
          await referralsRepo.create(referer.wallet_id, twitter, telegramLink);
        }
      }
    }
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

const getDetails = async (req, res) => {
  try {
    const { walletId } = req.query;
    const holder = await holderRepo.getById(walletId);
    return res.json({
      facebookLink: holder?.facebook_link || "",
      mediumLink: holder?.medium_link || "",
      linkedinLink: holder?.linkedin_link || "",
      twitterLink: holder?.twitter_link || "",
      telegramLink: holder?.telegram_link || "",
      pointRewardsStartAt: holder?.social_links_updated_at,
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
  getDetails,
};
