const router = require("express").Router();
const blogsController = require("../controllers/blogs");

router.get("/home-page-stats", blogsController.homePageStats);
module.exports = router;
