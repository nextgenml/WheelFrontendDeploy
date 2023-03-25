const router = require("express").Router();
const referralsController = require("../controllers/referrals");
const { validateWalletId } = require("./auth");

router.post("/", validateWalletId, referralsController.create);
router.put("/", validateWalletId, referralsController.update);
router.get("/", validateWalletId, referralsController.get);
module.exports = router;