const router = require("express").Router();
const holdersController = require("../controllers/holders");
const { validateWalletId } = require("./auth");

router.post(
  "/social-links",
  validateWalletId,
  holdersController.saveSocialLinks
);
router.get(
  "/social-links",
  validateWalletId,
  holdersController.saveSocialLinks
);
module.exports = router;
