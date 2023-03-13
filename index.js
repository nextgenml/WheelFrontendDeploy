require("dotenv").config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const cors = require("cors");
const moment = require("moment");
require("./manager/spinwheel");
require("./manager/wallet");
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

const {
  getParticipants,
  getWinners,
  getParticipantsOfSpin,
  getSpinParticipants,
} = require("./repository/spinwheel");
const { getRunningSpin } = require("./repository/spin.js");
const { nextSpinDetails } = require("./manager/scheduledSpins.js");
const config = require("./config");
const logger = require("./logger");
const socialSharingController = require("./controllers/socialSharing");
const quizController = require("./controllers/quizzes");
const walletController = require("./controllers/wallet");
const tokenController = require("./controllers/token");
const promotionsController = require("./controllers/promotions");
const blogsController = require("./controllers/blogs");
const { validateWalletId } = require("./auth");
const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.put("/update-blog-data", blogsController.updateBlogData);

app.get("/get-blog-data", blogsController.getBlogData);

app.post("/save-blog-data", blogsController.saveBlogData);

app.get("/spinner-data", async (req, res) => {
  try {
    let current_time = moment().utc().format();
    const [runningSpin, scheduledSpin] = await getRunningSpin(true);
    let data, participants, winners;
    const { walletAddress } = req.query;

    if (runningSpin && scheduledSpin) {
      [participants, winners] = await getParticipantsOfSpin(
        runningSpin,
        walletAddress
      );
      data = {
        participants,
        winners,
        end_time: current_time,
        no_of_winners: scheduledSpin.no_of_winners,
        spin_delay: scheduledSpin.spin_delay,
        prev_spin_type: scheduledSpin.type,
        next_spin_type: scheduledSpin.type,
      };
    } else {
      const [lastRunningSpin, lastScheduledSpin] = await getRunningSpin(false);
      let no_of_winners, spin_delay;
      if (lastRunningSpin) {
        no_of_winners = lastScheduledSpin.winner_prizes.split(",").length;
        spin_delay = lastScheduledSpin.spin_day;
        [participants, winners] = await getParticipantsOfSpin(
          lastRunningSpin,
          walletAddress
        );
      }
      const nextSpin = await nextSpinDetails();

      data = {
        participants,
        winners,
        end_time: nextSpin
          ? nextSpin.nextSpinAt.add(10, "seconds").format()
          : null,
        no_of_winners,
        spin_delay,
        prev_spin_type: lastScheduledSpin?.type,
        next_spin_type: nextSpin?.type,
      };
    }
    logger.info(JSON.stringify(data));

    res.json({
      ...data,
      start_time: current_time,
    });
  } catch (ex) {
    logger.error(`error occurred in spinner-data api: ${ex}`);
    res.sendStatus(500);
  }
});

app.get("/winners-data", async (req, res) => {
  try {
    const winner_data = await getWinners(
      req.query.from,
      req.query.to,
      req.query.type,
      req.query.walletAddress
    );

    const nextSpin = await nextSpinDetails(req.query.type);
    res.json({
      data: winner_data,
      next_spin_at: nextSpin
        ? nextSpin.nextSpinAt.add(10, "seconds")
        : undefined,
    });
  } catch (ex) {
    logger.error(`error occurred in winners-data api: ${ex}`);
    res.sendStatus(500);
  }
});

app.get("/participants-data", async (req, res) => {
  try {
    const resultType = req.query.winners === "yes" ? "winners" : "participants";
    const spin_no = parseInt(req.query.spin);
    const data = await getParticipants(
      req.query.from,
      req.query.to,
      resultType,
      req.query.type,
      spin_no,
      config.SECRET_KEY === req.headers["authorization"]
    );
    res.json(data);
  } catch (ex) {
    logger.error(`error occurred in participants-data api: ${ex}`);
    res.sendStatus(500);
  }
});

app.get("/spin-participants", async (req, res) => {
  try {
    const data = await getSpinParticipants(
      req.query.day,
      req.query.spin_no,
      req.query.type
    );
    res.json(data);
  } catch (ex) {
    logger.error(`error occurred in spinner-participants api: ${ex}`);
    res.sendStatus(500);
  }
});

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

app.use("/", express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "/client/build")));
app.use("/images/", static("./uploads/"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env["PORT"];

app.listen(port, function () {
  logger.info("----------------------------app start---------------------");
  logger.info(`app listening at ", "http://localhost: ${port}`);
});
