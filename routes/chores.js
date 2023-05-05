const router = require("express").Router();
const choresController = require("../controllers/chores");
const { validateAdmin, validateLoginSession } = require("./auth");

router.get("/topTweets", choresController.topTweets);
router.get(
  "/adminStats",
  validateLoginSession,
  validateAdmin,
  choresController.adminStats
);
module.exports = router;
