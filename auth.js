const validateWalletId = async (req, res, next) => {
  if (!req.query.walletId) {
    return res.status(401).json({
      statusCode: 400,
      message: "Wallet is missing",
    });
  } else return next();
};

module.exports = {
  validateWalletId,
};
