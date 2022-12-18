require("dotenv").config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const utils = require("./utils/index.js");
const { spin_hours, spin_minute, min_wallets_count } = require("./config.js");
const moment = require("moment");
require("./manager/spinwheelManager");

const {
  getParticipants,
  getWinners,
  getSpin,
  currentSpinData,
  getParticipantsOfSpin,
} = require("./repository/spinwheel");
const { getRunningSpin } = require("./repository/spin.js");
const { nextSpinDetails } = require("./manager/scheduledSpinsManager.js");

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", async (req, res) => {
  let current_time = moment().format();
  const [runningSpin, scheduledSpin] = await getRunningSpin(true);
  let data;

  if (runningSpin && scheduledSpin) {
    let [participants, winners] = await getParticipantsOfSpin(runningSpin);
    data = {
      participants,
      winners,
      end_time: current_time,
      no_of_winners: scheduledSpin.no_of_winners,
      spin_delay: scheduledSpin.spin_delay,
    };
  } else {
    const [lastRunningSpin, _] = await getRunningSpin(false);
    let [participants, winners] = await getParticipantsOfSpin(lastRunningSpin);
    const nextSpin = await nextSpinDetails();
    data = {
      participants,
      winners,
      end_time: nextSpin.nextSpinAt.add(10, "seconds").format(),
      no_of_winners: nextSpin.winnerPrizes.length,
      spin_delay: nextSpin.spinDelay,
    };
  }

  res.json({
    ...data,
    start_time: current_time,
  });
});

app.get("/winners-data", async (req, res) => {
  const winner_data = await getWinners(
    req.query.from,
    req.query.to,
    req.query.type
  );
  res.json(winner_data);
});

app.get("/participants-data", async (req, res) => {
  const type = req.query.winners === "yes" ? "winners" : "participants";
  const spin_no = parseInt(req.query.spin);
  const winner_data = await getParticipants(
    req.query.from,
    req.query.to,
    type,
    spin_no
  );
  res.json(winner_data);
});

app.get("/time-now", (req, res) => {
  res.send(new Date());
});
app.use("/", express.static(path.join(__dirname, "build")));
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("server is running");
  });
}
const port = process.env["PORT"] || 8000;
app.listen(port, function () {
  console.log("app listening at ", "http://localhost:" + port);
});
