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
const { validateWalletId } = require("./auth");

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", spinWheelController.spinnerData);

app.get("/winners-data", spinWheelController.winnerData);

app.get("/participants-data", spinWheelController.participantsData);

app.get("/spin-participants", spinWheelController.spinParticipants);

app.get("/time-now", (req, res) => {
  res.send(new Date());
});

// blog routes
app.post("/save-promotion", promotionsController.savePromotionRequest);
app.post("/approve-promotion", promotionsController.approvePromotionRequest);
app.get("/get-promotions", promotionsController.getAppliedRequests);
app.get("/promotions-admin", promotionsController.getAppliedRequestsAdmin);
app.post("/mark-promotion-done-user", promotionsController.markAsDoneByUser);
app.get("/get-custom-blogs", blogsController.getCustomBlogs);
app.get("/promoted-blogs", blogsController.getPromotedBlogs);
app.get("/promoted-blog-stats", blogsController.getBlogStats);
app.get("/blog-stats", blogsController.getUserBlogStats);
app.post("/update-blog-count", promotionsController.updateBlogCount);
app.get("/first-blog-at", blogsController.firstBlogAt);
app.get(
  "/custom-blogs-eligibility",
  promotionsController.eligibleForCustomBlogs
);
app.put("/update-blog-data", blogsController.updateBlogData);
app.get("/get-blog-data", blogsController.getBlogData);
app.post("/save-blog-data", upload.any(), blogsController.saveBlogData);

// social sharing routes
app.get("/social-sharing-stats", socialSharingController.getSocialSharingStats);
app.get("/social-sharing-chores", socialSharingController.getChoresByType);
app.post("/save-campaign", upload.any(), socialSharingController.saveCampaign);
app.get("/campaigns", socialSharingController.getCampaigns);
app.post("/update-campaign", socialSharingController.updateCampaign);
app.post(
  "/mark-chore-as-done",
  socialSharingController.markChoreAsCompletedByUser
);

// quizzes routes
app.post("/upload-quizzes", upload.any(), quizController.uploadQuiz);
app.get("/quizzes-by-level", quizController.getQuestionsByLevel);
app.post("/save-quiz-answers", quizController.saveAnswers);
app.get("/quizzes", quizController.getAllQuizzes);

// wallet routes
app.get("/get-wallet-details", walletController.getWalletDetails);
app.post("/update-alias", walletController.updateAlias);

// Token routes
app.get("/get-user-tokens", validateWalletId, tokenController.getUserTokens);
app.get("/admin-token-stats", validateWalletId, tokenController.getAdminStats);

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
