const {
  getParticipants,
  getWinners,
  getParticipantsOfSpin,
  getSpinParticipants,
} = require("../repository/spinwheel");
const { getRunningSpin } = require("../repository/spin.js");
const { nextSpinDetails } = require("../manager/scheduledSpins.js");
const config = require("../config/env");
const logger = require("../logger");
const moment = require("moment");
const spinWheel = require("../manager/spinwheel");
require("../manager/wallet");

const spinnerData = async (req, res) => {
  try {
    let current_time = moment().utc().format();
    const [runningSpin, scheduledSpin] = await getRunningSpin(true);
    let data, participants, winners;
    const { walletId } = req.query;

    if (runningSpin && scheduledSpin) {
      [participants, winners] = await getParticipantsOfSpin(
        runningSpin,
        walletId
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
          walletId
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
};

const winnerData = async (req, res) => {
  try {
    const winner_data = await getWinners(
      req.query.from,
      req.query.to,
      req.query.type,
      req.query.walletId
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
};

const participantsData = async (req, res) => {
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
};
const spinParticipants = async (req, res) => {
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
};

const getNextSpinEligibleUsers = async (req, res) => {
  const data = await spinWheel.getNextSpinEligibleUsers();
  return res.json({
    count: data.length,
  });
};

module.exports = {
  spinnerData,
  winnerData,
  participantsData,
  spinParticipants,
  getNextSpinEligibleUsers,
};
