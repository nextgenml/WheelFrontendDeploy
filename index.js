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
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
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

const {
  getSocialSharingStats,
  getChoresByType,
  saveCampaign,
} = require("./controllers/socialSharing");

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", async (req, res) => {
  try {
    let current_time = moment().format();
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
        end_time: nextSpin.nextSpinAt.add(10, "seconds").format(),
        no_of_winners,
        spin_delay,
        prev_spin_type: lastScheduledSpin?.type,
        next_spin_type: nextSpin.type,
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

// social sharing routes
app.get("/social-sharing-stats", getSocialSharingStats);
app.get("/social-sharing-chores", getChoresByType);
app.post("/save-campaign", upload.any(), saveCampaign);
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
