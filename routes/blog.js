const router = require("express").Router();
const blogsController = require("../controllers/blogs");
const { validateWalletId } = require("./auth");

router.get("/home-page-stats", validateWalletId, blogsController.homePageStats);
module.exports = router;
