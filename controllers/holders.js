const Web3 = require("web3");
const logger = require("../logger");
const { validateAtHandles, replaceTrailingSlash } = require("../manager/blogs");
const holderRepo = require("../repository/holder");
const referralsRepo = require("../repository/referrals");
const { config } = require("dotenv");
const { utils } = require("ethers");
const jwt = require("jsonwebtoken");

const getNonce = async (req, res) => {
  try {
    const { walletId } = req.query;
    const nonce = await holderRepo.getInviteCode(walletId);
    res.send({
      nonce,
    });
  } catch (error) {
    logger.info(`getNonce: ${error}`);
    res.status(400).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { address, signature } = req.body;
    console.log("req.body", req.body);
    if (!signature) return res.status(401).json({ error: "Invalid signature" });

    w3 = new Web3(new Web3.providers.HttpProvider(config.WEB3_PROVIDER_URL));

    const nonce = await holderRepo.getInviteCode(address);
    const actualAddress = utils.verifyMessage(nonce, signature);

    console.log("actualAddress", actualAddress, "address", address, nonce);
    if (actualAddress !== address)
      return res.status(401).json({ error: "Invalid signature" });

    const payload = { walletId: address };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.send({
      message: "login successful",
      token,
    });
  } catch (error) {
    logger.info(`login: ${error}`);

    res.status(400).json({ error: "Login Failed" });
  }
};
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
    console.log("walletId", walletId);
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
  login,
  getNonce,
};
