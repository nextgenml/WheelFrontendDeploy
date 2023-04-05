const router = require("express").Router();
const blogsController = require("../controllers/blogs");

router.get("/home-page-stats", blogsController.homePageStats);
router.get("/posted", blogsController.postedBlogs);
router.put("/posted", blogsController.updatePostedBlogs);
module.exports = router;
