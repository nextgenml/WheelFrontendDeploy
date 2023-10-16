const router = require("express").Router();
const controller = require("../../controllers/twitter/chores");

router.put("/:id", controller.updateChore);
router.put("/:id/verify", controller.verifyChoreLink);
module.exports = router;
