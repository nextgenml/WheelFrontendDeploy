var router = require("express").Router();

router.use("/api/v1/blogs", require("./blog"));
router.use("/api/v1/spinWheel", require("./spinWheel"));
router.use("/api/v1/holders", require("./holders"));
router.use("/api/v1/referrals", require("./referrals"));
router.use("/api/v1/payments", require("./payments"));

module.exports = router;
