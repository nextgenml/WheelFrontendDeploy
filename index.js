require("dotenv").config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const cors = require("cors");
const moment = require("moment");
require("./manager/spinwheelManager");
require("./manager/walletManager");

const {
  getParticipants,
  getWinners,
  getParticipantsOfSpin,
  getSpinParticipants,
} = require("./repository/spinwheel");
const { getRunningSpin } = require("./repository/spin.js");
const { nextSpinDetails } = require("./manager/scheduledSpinsManager.js");
const config = require("./config");

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", async (req, res) => {
  let current_time = moment().format();
  const [runningSpin, scheduledSpin] = await getRunningSpin(true);
  let data, participants, winners;

  if (runningSpin && scheduledSpin) {
    [participants, winners] = await getParticipantsOfSpin(runningSpin);
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
      [participants, winners] = await getParticipantsOfSpin(lastRunningSpin);
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

  const nextSpin = await nextSpinDetails(req.query.type);
  res.json({
    data: winner_data,
    next_spin_at: nextSpin ? nextSpin.nextSpinAt.add(10, "seconds") : undefined,
  });
});

app.get("/participants-data", async (req, res) => {
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
});

app.get("/spin-participants", async (req, res) => {
  const data = await getSpinParticipants(
    req.query.day,
    req.query.spin_no,
    req.query.type
  );
  res.json(data);
});

app.get("/time-now", (req, res) => {
  res.send(new Date());
});

app.use("/", express.static(path.join(__dirname, "build")));

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env["PORT"] || 8000;

app.listen(port, function () {
  console.log("app listening at ", "http://localhost:" + port);
});
