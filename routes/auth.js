const jwt = require("jsonwebtoken");
const config = require("../config/env");

const validateWalletId = async (req, res, next) => {
  if (!req.query.walletId) {
    return res.status(401).json({
      statusCode: 400,
      message: "Wallet is missing",
    });
  } else return next();
};

const validateAdmin = async (req, res, next) => {
  const telegramKey = req.headers.telegram_auth;
  if (telegramKey === process.env.TELEGRAM_ADMIN_KEY) return next();

  if (req.query.walletId !== config.ADMIN_WALLET) {
    return res.status(401).json({
      statusCode: 400,
      message: "You are not authorized",
    });
  } else return next();
};

const validateLoginSession = async (req, res, next) => {
  const telegramKey = req.headers.telegram_auth;
  if (
    [process.env.TELEGRAM_ADMIN_KEY, process.env.TELEGRAM_USER_KEY].includes(
      telegramKey
    )
  )
    return next();

  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      statusCode: 400,
      message:
        "Invalid session. Please disconnect and reconnect your metamask wallet again",
    });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        statusCode: 400,
        message:
          "Invalid session. Please disconnect and reconnect your metamask wallet again",
      });
    }
    console.log("logged in wallet", decoded.walletId);
    req.query.walletId = decoded.walletId;
    return next();
  });
};

const extractWallet = async (req, res, next) => {
  const telegramKey = req.headers.telegram_auth;
  if (telegramKey === process.env.TELEGRAM_USER_KEY) return next();

  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        console.log("extracted wallet", decoded.walletId);
        req.query.walletId = decoded.walletId;
        return next();
      } else {
        return res.status(401).json({
          statusCode: 400,
          message:
            "Invalid session. Please disconnect and reconnect your metamask wallet again",
        });
      }
    });
  } else {
    console.log("checking token", failed);

    return res.status(401).json({
      statusCode: 400,
      message:
        "Invalid session. Please disconnect and reconnect your metamask wallet again",
    });
  }
};

const extractWalletSoft = async (req, res, next) => {
  const telegramKey = req.headers.telegram_auth;
  if (telegramKey === process.env.TELEGRAM_USER_KEY) return next();

  const token = req.headers.authorization;
  req.query.walletId = "";
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        console.log("extracted wallet", decoded.walletId);
        req.query.walletId = decoded.walletId;
        return next();
      } else {
        return next();
      }
    });
  } else {
    return next();
  }
};
module.exports = {
  extractWalletSoft,
  validateWalletId,
  validateLoginSession,
  extractWallet,
  validateAdmin,
};
