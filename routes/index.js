var router = require("express").Router();

router.use("/api/v1/blogs", require("./blog"));
router.use("/api/v1/spinWheel", require("./spinWheel"));
router.use("/api/v1/holders", require("./holders"));
router.use("/api/v1/referrals", require("./referrals"));
router.use("/api/v1/payments", require("./payments"));
router.use("/api/v1/socialSharing", require("./socialSharing"));
router.use("/api/v1/contentProducer", require("./chatgpt"));
router.use("/api/v1/scheduledSpins", require("./scheduled_spins"));
router.use("/api/v1/chores", require("./chores"));
router.use("/api/v1/health", require("./health"));

module.exports = router;
