const router = require("express").Router();
const choresController = require("../controllers/chores");

router.get("/topTweets", choresController.topTweets);
module.exports = router;
