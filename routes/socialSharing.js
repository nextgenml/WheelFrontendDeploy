const router = require("express").Router();
const socialSharingController = require("../controllers/socialSharing");
const { validateWalletId } = require("./auth");

router.put(
  "/chores/:choreId/done",
  validateWalletId,
  socialSharingController.markChoreAsCompletedByUser
);
module.exports = router;
