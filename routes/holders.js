const router = require("express").Router();
const holdersController = require("../controllers/holders");
const {
  validateWalletId,
  validateLoginSession,
  validateAdmin,
} = require("./auth");

router.post(
  "/social-links",
  validateLoginSession,
  holdersController.saveSocialLinks
);
router.post("/login", holdersController.login);
router.get("/details", holdersController.getDetails);
router.get("/nonce", validateWalletId, holdersController.getNonce);
router.get(
  "/search",
  validateLoginSession,
  validateAdmin,
  holdersController.searchHolders
);

router.put(
  "/",
  validateLoginSession,
  validateAdmin,
  holdersController.saveHolderByAdmin
);
module.exports = router;
