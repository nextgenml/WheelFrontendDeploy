const router = require("express").Router();
const controller = require("../../controllers/twitter/chores");

router.get("/campaign_stats", controller.campaignStats);
router.post("/", controller.campaignStats);
module.exports = router;
