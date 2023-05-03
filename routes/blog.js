const router = require("express").Router();
const blogsController = require("../controllers/blogs");
const { validateLoginSession, validateAdmin } = require("./auth");

router.get("/home-page-stats", blogsController.homePageStats);
router.get("/posted", validateLoginSession, blogsController.postedBlogs);
router.put("/posted", validateLoginSession, blogsController.updatePostedBlogs);
router.get(
  "/adhoc_spin/participants",
  validateLoginSession,
  validateAdmin,
  blogsController.getAdhocSpinParticipants
);
module.exports = router;
