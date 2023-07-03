const router = require("express").Router();
const controller = require("../controllers/health");

router.get("/app", controller.checkApp);
router.get("/db", controller.checkDb);
module.exports = router;
