const router = require("express").Router();
const holdersController = require("../controllers/holders");
const { validateWalletId } = require("./auth");

router.post(
  "/social-links",
  validateWalletId,
  holdersController.saveSocialLinks
);
router.post("/login", holdersController.login);
router.get("/details", validateWalletId, holdersController.getDetails);
module.exports = router;
