const router = require("express").Router();
const choresController = require("../controllers/movie-tickets/chores");
const moviesController = require("../controllers/movie-tickets/movies");
const referralsController = require("../controllers/movie-tickets/referrals");

const { validateLoginSession, validateAdmin } = require("./auth");
const multer = require("multer");
const path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/movies/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});
var upload = multer({ storage: storage });

router.get("/chores", choresController.get);
router.post("/chores", choresController.create);
router.put("/chores/:id", choresController.update);

router.get("/movies/latest", moviesController.get);
router.get("/movies", moviesController.list);
router.post("/movies", upload.any(), moviesController.create);
router.put("/movies/:movieId", upload.any(), moviesController.update);

router.get("/referrals/", referralsController.get);
router.post("/referrals/", referralsController.create);

router.get("/movies/:id/canUpload", moviesController.canUploadTickets);

module.exports = router;
