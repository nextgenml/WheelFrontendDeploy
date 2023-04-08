const router = require("express").Router();
const socialSharingController = require("../controllers/socialSharing");
const { validateWalletId } = require("./auth");

router.put(
  "/chores/:choreId/done",
  validateWalletId,
  socialSharingController.markChoreAsCompletedByUser
);
router.put(
  "/chores/:choreId/validate/:action",
  validateWalletId,
  socialSharingController.validateChore
);
module.exports = router;
