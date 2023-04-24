const router = require("express").Router();
const blogsController = require("../controllers/blogs");
const { validateLoginSession } = require("./auth");

router.get("/home-page-stats", blogsController.homePageStats);
router.get("/posted", validateLoginSession, blogsController.postedBlogs);
router.put("/posted", validateLoginSession, blogsController.updatePostedBlogs);
module.exports = router;
