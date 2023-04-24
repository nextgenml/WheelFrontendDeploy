const router = require("express").Router();
const referralsController = require("../controllers/referrals");
const { validateLoginSession, extractWallet } = require("./auth");

router.post("/", validateLoginSession, referralsController.create);
router.put("/:id", validateLoginSession, referralsController.update);
router.get("/", validateLoginSession, referralsController.get);
router.get("/top", extractWallet, referralsController.topReferrals);
module.exports = router;
