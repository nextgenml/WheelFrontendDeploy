var router = require("express").Router();

router.use("/api/v1/blogs", require("./blog"));

module.exports = router;
