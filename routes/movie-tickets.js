const router = require("express").Router();
const choresController = require("../controllers/movie-tickets/chores");
const moviesController = require("../controllers/movie-tickets/movies");
const referralsController = require("../controllers/movie-tickets/referrals");

const { validateLoginSession } = require("./auth");
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

router.get("/chores", validateLoginSession, choresController.get);
router.post("/chores", validateLoginSession, choresController.create);
router.put("/chores/:id", validateLoginSession, choresController.update);

router.get("/movies/latest", validateLoginSession, moviesController.get);
router.get("/movies", validateLoginSession, moviesController.list);
router.post(
  "/movies",
  upload.any(),
  validateLoginSession,
  moviesController.create
);
router.put(
  "/movies/:movieId",
  upload.any(),
  validateLoginSession,
  moviesController.update
);

router.get("/referrals/", validateLoginSession, referralsController.get);
router.post("/referrals/", validateLoginSession, referralsController.create);

module.exports = router;
