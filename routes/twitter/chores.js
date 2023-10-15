const router = require("express").Router();
const controller = require("../../controllers/twitter/chores");

router.put("/:id", controller.updateChore);
module.exports = router;
