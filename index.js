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
const logger = require("./logger");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "nextgenml",
});

app.post("/save-blog-data", async (req, res) => {
  const data = req.body;
  const transactionId = uuidv4();

  // Save the data to the database or process it as needed
  const {
    wallet_address,
    initiative,
    prompt,
    blog,
    link,
    validated_flag,
    paid_amount,
    paid_flag,
  } = req.body;

  if (
    !wallet_address ||
    !initiative ||
    !prompt ||
    !blog ||
    !link ||
    !paid_amount > 0
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  const create_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  // save in DB
  connection.query(
    `INSERT INTO saved_prompts(transactionID, wallet_address, initiative, prompt, blog, link, create_date, validated_flag, paid_amount, paid_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transactionId,
      wallet_address,
      initiative,
      prompt,
      blog,
      link,
      create_date,
      validated_flag,
      paid_amount,
      paid_flag,
    ],
    (error, results) => {
      if (error) {
        return res.status(500).json({ msg: "Internal server error" });
        // return res.status(500).send(error);
      }
      res.status(200).json({ msg: "Data saved successfully" });
    }
  );
});

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

app.use("/", express.static(path.join(__dirname, "build")));

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env["PORT"];

app.listen(port, function () {
  logger.info("----------------------------app start---------------------");
  logger.info(`app listening at ", "http://localhost: ${port}`);
});
