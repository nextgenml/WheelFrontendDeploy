require("dotenv").config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const utils = require("./utils/index.js");
const { spin_hours, spin_minute } = require("./config.js");
// const fetchAddress = require('./script/tracking')
//import express from 'express'
//import path from 'path';
//import fs from 'fs';
//import cors from 'cors';
//import utils from './utils/index.js';
//import { spin_hours, spin_minute } from '../config.js'
const { getParticipants, getWinners } = require("./repository/spinwheel");

const app = express();

utils.randomItemSetter();

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.get("/spinner-data", async (req, res) => {
  let spinner_data_file = JSON.parse(
    fs.readFileSync(path.join(__dirname, "spinner_data.json"))
  );
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
  end_date.setSeconds(5);

  let hours_diff = Math.abs(end_date.getHours() - current_time.getHours());
  if (hours_diff > 12) {
    hours_diff = hours_diff - 12;
  }
  let time_diff = (end_date - current_time) / 1000;

  let minute_diff = (time_diff / 60) % 3600;

  if (
    Object.keys(spinner_data_file).length === 0 ||
    !spinner_data_file[today_date_str]
  ) {
    // const initial_items = JSON.parse(fs.readFileSync(initial_spinner_data_file_path))
    // if (!spinner_data_file) {
    //     spinner_data_file = {}
    // }
    // spinner_data_file[today_date_str] = initial_items;
    // fs.writeFileSync(spinner_data_file_path, JSON.stringify(spinner_data_file))
    res.json({
      current_time: {
        hours: hours_diff,
        minutes: minute_diff,
        seconds: current_time.getSeconds(),
      },
      start_time: current_time.toUTCString(),
      end_time: end_date.toUTCString(),
    });
    return;
  }

  res.json({
    ...spinner_data_file,
    current_time: {
      hours: hours_diff,
      minutes: minute_diff,
      seconds: current_time.getSeconds(),
    },
    start_time: current_time.toUTCString(),
    end_time: end_date.toUTCString(),
  });
});

app.get("/winners-data", (req, res) => {
  const winner_data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "winners_data.json"))
  );
  res.json(winner_data);
});

app.get("/winners-data-1", async (req, res) => {
  console.log("req.params.date", req.query);
  const winner_data = await getWinners(req.query.date, req.query.date);
  res.json(winner_data);
});

app.get("/participants-data", async (req, res) => {
  const type = req.query.winners === "yes" ? "winners" : "participants";
  const winner_data = await getParticipants(
    req.query.date,
    req.query.date,
    type
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
