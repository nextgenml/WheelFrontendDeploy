const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const { static } = require("express");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});
var upload = multer({ storage: storage });
const logger = require("./logger");
const socialSharingController = require("./controllers/socialSharing");
const spinWheelController = require("./controllers/spinWheel");
const quizController = require("./controllers/quizzes");
const walletController = require("./controllers/wallet");
const tokenController = require("./controllers/token");
const promotionsController = require("./controllers/promotions");
const blogsController = require("./controllers/blogs");
const {
  validateWalletId,
  validateLoginSession,
  extractWallet,
} = require("./routes/auth");

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", extractWallet, spinWheelController.spinnerData);

app.get("/winners-data", extractWallet, spinWheelController.winnerData);

app.get("/participants-data", spinWheelController.participantsData);

app.get("/spin-participants", spinWheelController.spinParticipants);

app.get("/time-now", (req, res) => {
  res.send(new Date());
});

// blog routes
app.post(
  "/save-promotion",
  validateLoginSession,
  promotionsController.savePromotionRequest
);
app.post(
  "/approve-promotion",
  validateLoginSession,
  promotionsController.approvePromotionRequest
);
app.get(
  "/get-promotions",
  validateLoginSession,
  promotionsController.getAppliedRequests
);
app.get(
  "/promotions-admin",
  validateLoginSession,
  promotionsController.getAppliedRequestsAdmin
);
app.post(
  "/mark-promotion-done-user",
  validateLoginSession,
  promotionsController.markAsDoneByUser
);
app.get(
  "/get-custom-blogs",
  validateLoginSession,
  blogsController.getCustomBlogs
);
app.get(
  "/promoted-blogs",
  validateLoginSession,
  blogsController.getPromotedBlogs
);
app.get(
  "/promoted-blog-stats",
  validateLoginSession,
  blogsController.getBlogStats
);
app.get("/blog-stats", validateLoginSession, blogsController.getUserBlogStats);
app.post(
  "/update-blog-count",
  validateLoginSession,
  promotionsController.updateBlogCount
);
app.get(
  "/custom-blogs-eligibility",
  validateLoginSession,
  promotionsController.eligibleForCustomBlogs
);
app.put(
  "/update-blog-data",
  validateLoginSession,
  blogsController.updateBlogData
);
app.get("/get-blog-data", validateLoginSession, blogsController.getBlogData);
app.post(
  "/save-blog-data",
  validateLoginSession,
  upload.any(),
  blogsController.saveBlogData
);

// social sharing routes
app.get("/social-sharing-stats", socialSharingController.getSocialSharingStats);
app.get("/social-sharing-chores", socialSharingController.getChoresByType);
app.post("/save-campaign", upload.any(), socialSharingController.saveCampaign);
app.get("/campaigns", socialSharingController.getCampaigns);
app.post("/update-campaign", socialSharingController.updateCampaign);

// quizzes routes
app.post("/upload-quizzes", upload.any(), quizController.uploadQuiz);
app.get("/quizzes-by-level", quizController.getQuestionsByLevel);
app.post("/save-quiz-answers", quizController.saveAnswers);
app.get("/quizzes", quizController.getAllQuizzes);

// wallet routes
app.get("/get-wallet-details", walletController.getWalletDetails);
app.post("/update-alias", walletController.updateAlias);

// Token routes
app.get("/get-user-tokens", tokenController.getUserTokens);
app.get("/admin-token-stats", validateWalletId, tokenController.getAdminStats);

app.use("/", require("./routes/index"));

app.use("/", express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "/client/build")));
app.use("/images/", static("./uploads/"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT;

app.listen(port, function () {
  logger.info("----------------------------app start---------------------");
  logger.info(`app listening at ", "http://localhost: ${port}`);
});
