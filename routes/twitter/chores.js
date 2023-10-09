const router = require("express").Router();
const controller = require("../../controllers/twitter/chores");

router.get("/campaign_stats", controller.campaignStats);
router.put("/:id", controller.updateChore);
module.exports = router;
