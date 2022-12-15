require("dotenv").config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const utils = require("./utils/index.js");
const { spin_hours, spin_minute } = require("./config.js");
const moment = require("moment");
// const fetchAddress = require('./script/tracking')
//import express from 'express'
//import path from 'path';
//import fs from 'fs';
//import cors from 'cors';
//import utils from './utils/index.js';
//import { spin_hours, spin_minute } from '../config.js'
const {
  getParticipants,
  getWinners,
  getSpin,
  currentSpinData,
} = require("./repository/spinwheel");

const app = express();

utils.randomItemSetter();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

const relativeSpinIndex = (hour) => {
  for (i = 0; i < spin_hours.length - 1; i += 1) {
    if (spin_hours[i] < hour && hour < spin_hours[i + 1]) return i + 1;
  }
  return hour > spin_hours[spin_hours.length - 1] ? spin_hours.length : -1;
};
const getSpinData = async (spin) => {
  const today_date_str = utils.dateToString(new Date());
  let today_spinner_data = await currentSpinData(spin);
  if (today_spinner_data && today_spinner_data.items.length) {
    return {
      [today_date_str]: today_spinner_data,
    };
  }
};
const getWinnersForSpin = async (spin_no) => {
  let date = new Date();
  const formattedDate = moment(date).format("DD/MM/YYY");

  const winners = await getWinners(date, date);
  const currentSpin = await getSpin(spin_no);
  const currentSpinRow = winners.filter(
    (w) => w.spin.toString() === spin_no.toString()
  )[0];
  if (currentSpin && currentSpinRow) {
    return {
      [formattedDate]: {
        [spin_hours[spin_no - 1]]: {
          updated_at: currentSpin.updated_at,
          winners: [
            currentSpinRow.first,
            currentSpinRow.second,
            currentSpinRow.third,
          ],
        },
      },
    };
  }
};
app.get("/spinner-data", async (req, res) => {
  const today_date_str = utils.dateToString(new Date());
  let current_time = new Date();
  let end_date = new Date();
  let end_hour = 12;

  if (current_time.getHours() > 21) {
    end_hour = 24 - current_time.getHours() + spin_hours[0];
  } else {
  }
  for (let i = 0; i < spin_hours.length; i++) {
    let diff = spin_hours[i] - current_time.getHours();
    if (diff >= 0) {
      if (diff === 0) {
        if (current_time.getMinutes() <= spin_minute) {
          end_hour = Math.min(end_hour, diff);
        }
      } else {
        end_hour = Math.min(end_hour, diff);
      }
    }
  }

  end_date.setHours(current_time.getHours() + end_hour);
  end_date.setMinutes(spin_minute);
  end_date.setSeconds(10);

  let hours_diff = Math.abs(end_date.getHours() - current_time.getHours());
  if (hours_diff > 12) {
    hours_diff = hours_diff - 12;
  }
  let time_diff = (end_date - current_time) / 1000;

  let minute_diff = (time_diff / 60) % 3600;

  let date = new Date();
  let hours = date.getHours();
  let spinner_data;
  if (spin_hours.indexOf(hours) > -1) {
    let spin_no = spin_hours.indexOf(hours) + 1;
    spinner_data = await getSpinData(spin_no);
    if (!spinner_data && spin_no - 1 > 0) {
      spinner_data = await getSpinData(spin_no - 1);
    }
  } else {
    let spinIndex = relativeSpinIndex(hours);
    spinner_data = await getSpinData(spinIndex);
  }
  if (
    spinner_data &&
    spinner_data[today_date_str] &&
    spinner_data[today_date_str].items.length < 6
  )
    spinner_data = null;
  if (spinner_data) {
    res.json({
      ...spinner_data,
      current_time: {
        hours: hours_diff,
        minutes: minute_diff,
        seconds: current_time.getSeconds(),
      },
      start_time: current_time.toUTCString(),
      end_time: end_date.toUTCString(),
    });
  } else {
    res.json({
      current_time: {
        hours: hours_diff,
        minutes: minute_diff,
        seconds: current_time.getSeconds(),
      },
      start_time: current_time.toUTCString(),
      end_time: end_date.toUTCString(),
    });
  }
});

app.get("/winners-data", async (req, res) => {
  let date = new Date();
  let hours = date.getHours();
  let winners_data;
  if (spin_hours.indexOf(hours) > -1) {
    let spin_no = spin_hours.indexOf(hours) + 1;
    winners_data = await getWinnersForSpin(spin_no);
    if (!winners_data && spin_no - 1 > 0) {
      winners_data = await getWinnersForSpin(spin_no - 1);
    }
  } else {
    let spinIndex = relativeSpinIndex(hours);
    winners_data = await getWinnersForSpin(spinIndex);
  }

  if (winners_data) res.json(winners_data);
  else res.json({});
});

app.get("/winners-data-1", async (req, res) => {
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
  //console.log("app listening at ", "http://localhost:" + port);
});
