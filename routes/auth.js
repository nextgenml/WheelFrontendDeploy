const jwt = require("jsonwebtoken");

const validateWalletId = async (req, res, next) => {
  if (!req.query.walletId) {
    return res.status(401).json({
      statusCode: 400,
      message: "Wallet is missing",
    });
  } else return next();
};

const validateLoginSession = async (req, res, next) => {
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
  const token = req.headers.authorization;
  if (token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        console.log("extracted wallet", decoded.walletId);
        req.query.walletId = decoded.walletId;
        return next();
      }
    });
};

module.exports = {
  validateWalletId,
  validateLoginSession,
  extractWallet,
};
