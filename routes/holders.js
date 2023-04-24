const router = require("express").Router();
const holdersController = require("../controllers/holders");
const { validateWalletId, validateLoginSession } = require("./auth");

router.post(
  "/social-links",
  validateLoginSession,
  holdersController.saveSocialLinks
);
router.post("/login", holdersController.login);
router.get("/details", validateLoginSession, holdersController.getDetails);
router.get("/nonce", validateWalletId, holdersController.getNonce);
module.exports = router;
