const {
  spin_hours,
  spin_minute,
  next_spin_delay,
  min_wallets_count,
} = require("../config.js");
const fetchAddress = require("../script/tracking");
const {
  dataExistsForCurrentSpin,
  createParticipant,
  currentSpinData,
  getSpin,
  updateSpin,
  getWinners,
  getParticipants,
  createSpin,
  markAsWinner,
  currSpinParticipants,
} = require("../repository/spinwheel.js");
const { nextSpinDetails } = require("./scheduledSpinsManager.js");
const { isAnySpinStarting } = require("../repository/spin.js");
const moment = require("moment");
const { updateLaunchDate } = require("../repository/scheduledSpin.js");
const { splitIntoGroups } = require("../utils/spinwheelUtil.js");

let currentSpinTimeout = null;
let currentSpinId = null;
const initiateNextSpin = () => {
  let alreadyExecuting = false;
  console.log("process started");
  setInterval(async () => {
    if (alreadyExecuting) return;
    alreadyExecuting = true;

    const nextSpin = await nextSpinDetails();

    if (nextSpin) {
      const isSpinStarting = await isAnySpinStarting(nextSpin.id);
      if (!isSpinStarting) {
        await createSpin(nextSpin);
        console.log("created next spin", nextSpin);
      }

      // after scheduling a spin, if some update happens in the DB
      if (currentSpinId && currentSpinId != nextSpin.id) deleteScheduledJob();

      if (!currentSpinTimeout) {
        const waitingTime = nextSpin.nextSpinAt.diff(moment(), "ms");

        currentSpinTimeout = setTimeout(
          () => createParticipants(nextSpin),
          waitingTime
        );
        console.log("scheduled next spin cycle", nextSpin, waitingTime);
      }
    } else if (currentSpinTimeout) deleteScheduledJob();
    alreadyExecuting = false;
  }, 1000);
};

const createParticipants = async (nextSpin) => {
  const wallets = await fetchAddress();
  const currDate = moment();
  for (const item of wallets) {
    // ignoring last 18 characters from wallet amount
    const value = item[1].toString().substring(0, item[1].length - 18);
    await createParticipant(item[0], value, nextSpin, currDate);
  }
  await updateLaunchDate(nextSpin, currDate);

  const currParticipants = await currSpinParticipants(
    nextSpin.prevLaunchAt,
    currDate,
    nextSpin.minWalletValue
  );
  console.log("currParticipants", currParticipants);
  if (currParticipants && currParticipants.length >= min_wallets_count) {
    const groups = splitIntoGroups(currParticipants, 25);
    groups.forEach((group, index) => {
      setTimeout(() => processWinners(group, nextSpin), 20 * 1000 * index);
    });
  } else {
    console.warn(
      "skipping spinner because min wallets criteria not met for ",
      nextSpin.id,
      nextSpin.type
    );
  }
};

const processWinners = async (group, nextSpin) => {
  let index = 0;
  for (const prize of nextSpin.winnerPrizes) {
    setTimeout(async () => {
      const winner = pickWinner(group);
      await markAsWinner(winner.id, index + 1, prize);
      group = group.filter((g) => g.id !== winner.id);
    }, index * nextSpin.spinDelay);
    index += 1;
  }
};
const deleteScheduledJob = () => {
  clearTimeout(currentSpinTimeout);
  currentSpinTimeout = null;
  currentSpinId = null;
};
const hasWinnerAlready = (group, rank) => {
  return group.filter((x) => x.rank == rank).length > 0;
};

function initiateSpinProcess() {
  EXECUTING = false;
  console.log("process started");
  setInterval(async () => {
    try {
      if (EXECUTING) return;
      EXECUTING = true;
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let secs = date.getSeconds();
      if (spin_hours.indexOf(hours) >= 0) {
        if (minutes === spin_minute) {
          const spin_no = spin_hours.indexOf(hours) + 1;
          console.log("running new spin", spin_no, hours, spin_minute);
          spin_data_exists = await dataExistsForCurrentSpin(spin_no);
          let currentSpin, today_spinner_data;
          if (!spin_data_exists) {
            const new_addresses = await fetchAddress();
            if (Object.keys(new_addresses).length === 0) {
              throw "No transactions for the period!";
            }
            console.log(new_addresses, "fresh spin");
            currentSpin = await createSpin(spin_no);
            for (const item of new_addresses) {
              const value = item[1]
                .toString()
                .substring(0, item[1].length - 18);
              await createParticipant(item[0], value, spin_no);
            }
            today_spinner_data = await currentSpinData(spin_no);
            if (today_spinner_data["items"].length < 6) {
              console.warn("Insufficient spinner items, length < 6");
              return;
            }
            await updateWinners();
          } else {
            currentSpin = await getSpin(spin_no);
            today_spinner_data = await currentSpinData(spin_no);
          }
          if (today_spinner_data["items"].length < 6) {
            console.warn("Insufficient spinner items, length < 6");
            return;
          }
          let update_time = new Date(today_spinner_data["updated_at"]);
          if (Math.abs(secs - update_time.getSeconds()) >= next_spin_delay)
            await updateWinners();
        }
      }
      EXECUTING = false;
    } catch (err) {
      console.log(err);
      EXECUTING = false;
    }
  }, 1000);
}
const updateWinners = async () => {
  let date = new Date();
  let hours = date.getHours();
  console.log("running updateWinners");
  if (spin_hours.indexOf(hours) > -1) {
    const spin_no = spin_hours.indexOf(hours) + 1;
    const currentSpin = await getSpin(spin_no);

    let participants = await getParticipants(date, date, "participants");
    participants = participants.filter(
      (w) => w.spin.toString() === spin_no.toString()
    );
    if (!participants.length || !currentSpin) return;

    const winners = await getWinners(date, date);
    const currentSpinRow = winners.filter(
      (w) => w.spin.toString() === spin_no.toString()
    )[0];
    console.log("currentSpinRow", currentSpinRow);

    if (!currentSpinRow || !currentSpinRow.first) {
      const winner = pickWinner(participants);
      await markAsWinner(winner.id, 1);
      await updateSpin(currentSpin.id);
    } else if (!currentSpinRow.second) {
      participants = participants.filter((p) => !p.rank);
      const winner = pickWinner(participants);
      await markAsWinner(winner.id, 2);
      await updateSpin(currentSpin.id);
    } else if (!currentSpinRow.third) {
      participants = participants.filter((p) => !p.rank);
      const winner = pickWinner(participants);
      await markAsWinner(winner.id, 3);
      await updateSpin(currentSpin.id);
    }
  }
};
const pickWinner = (participants) => {
  const size = participants.length;
  const index = Math.floor(Math.random() * size);
  return participants[index];
};

initiateNextSpin();
// initiateSpinProcess();
