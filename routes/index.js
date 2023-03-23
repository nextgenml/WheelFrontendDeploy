var router = require("express").Router();

router.use("/api/v1/blogs", require("./blog"));
router.use("/api/v1/spinWheel", require("./spinWheel"));
router.use("/api/v1/holders", require("./holders"));

module.exports = router;
