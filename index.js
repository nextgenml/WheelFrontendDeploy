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

const relativeSpinIndex = (hour) => {
  for (i = 0; i < spin_hours.length - 1; i += 1) {
    if (spin_hours[i] < hour && hour < spin_hours[i + 1]) return i + 1;
  }
  return hour > spin_hours[spin_hours.length - 1] ? spin_hours.length : -1;
};
const getSpinData = async (spin) => {
  let today_spinner_data = await currentSpinData(spin);
  if (
    today_spinner_data &&
    today_spinner_data.items.length >= min_wallets_count
  ) {
    return today_spinner_data;
  }
};
const getWinnersForSpin = async (spin_no) => {
  let date = new Date();

  const winners = await getWinners(date, date);
  const currentSpin = await getSpin(spin_no);
  const currentSpinRow = winners.filter(
    (w) => w.spin.toString() === spin_no.toString()
  )[0];
  if (currentSpin && currentSpinRow) {
    return {
      winners: [
        currentSpinRow.first,
        currentSpinRow.second,
        currentSpinRow.third,
      ],
    };
  }
  return {};
};
app.get("/spinner-data", async (req, res) => {
  let current_time = new Date();
  const [runningSpin, scheduledSpin] = await getRunningSpin();
  let data;

  if (runningSpin && scheduledSpin) {
    [participants, winners] = await getParticipantsOfSpin(runningSpin);
    data = {
      participants,
      winners,
      end_time: current_time.toUTCString(),
      no_of_winners: scheduledSpin.no_of_winners,
      spin_delay: scheduledSpin.spin_delay,
    };
  } else {
    const nextSpin = await nextSpinDetails();
    data = {
      end_time: nextSpin.nextSpinAt.format(),
      no_of_winners: nextSpin.winnerPrizes.length,
      spin_delay: nextSpin.spinDelay,
    };
  }

  res.json({
    ...data,
    start_time: current_time.toUTCString(),
  });
});

app.get("/winners-data", async (req, res) => {
  console.log("req.params.date", req.query);
  const winner_data = await getWinners(req.query.from, req.query.to);
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
