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
  getWinners,
  getParticipants,
  markAsWinner,
} = require("../repository/spinwheel.js");
// const {createParticipant} = require("./repository/spinwheel.js");
const { nextSpinDetails } = require("./scheduledSpinsManager.js");
const {
  isAnySpinStarting,
  createSpin,
  markSpinAsDone,
} = require("../repository/spin.js");
const moment = require("moment");
const { updateLaunchDate } = require("../repository/scheduledSpin.js");
const { splitIntoGroups } = require("../utils/spinwheelUtil.js");
const { currSpinParticipants } = require("../repository/wallet.js");
const { timer } = require("../utils/index.js");

let currentSpinTimeout = null;
let currentSpinId = null;
const initiateNextSpin = () => {
  let running = false;
  console.log("spin process started");
  setInterval(async () => {
    if (running) return;
    running = true;

    const nextSpin = await nextSpinDetails();

    if (nextSpin) {
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
    running = false;
  }, 1000);
};

const createParticipants = async (nextSpin) => {
  console.log("creating participants");
  const spin = await createSpin(nextSpin);

  const currParticipants = await currSpinParticipants(
    nextSpin.prevLaunchAt,
    nextSpin.minWalletValue
  );
  console.log("currParticipants", currParticipants.length);

  for (const item of currParticipants) {
    const participant = await createParticipant(
      item.walletId,
      item.value,
      nextSpin
    );
    item["id"] = participant.insertId;
  }
  await updateLaunchDate(nextSpin.id);

  if (currParticipants && currParticipants.length >= min_wallets_count) {
    const groups = splitIntoGroups(currParticipants, 25);
    await processWinners(groups[0], nextSpin, spin);

    // groups.forEach((group, index) => {
    //   // setTimeout(
    //   //   () => processWinners(group, nextSpin, spin),
    //   //   nextSpin.spinDelay * 1000 * index
    //   // );
    // });
  } else {
    console.warn(
      "skipping spinner because min wallets criteria not met for ",
      nextSpin.id,
      nextSpin.type
    );
  }
};

const processWinners = async (group, nextSpin, spin) => {
  for (let index = 1; index <= nextSpin.winnerPrizes.length; index += 1) {
    const [winner, rIndex] = pickWinner(group);
    const prize = nextSpin.winnerPrizes[index - 1];
    console.log("winner", winner.id, prize, index);
    await markAsWinner(winner.id, index, prize);
    group.splice(rIndex, 1);

    if (index == nextSpin.winnerPrizes.length) await markSpinAsDone(spin.id);
    else await timer(index * nextSpin.spinDelay * 1000);
  }
};

const pickWinner = (participants) => {
  const size = participants.length;
  const index = Math.floor(Math.random() * size);
  return [participants[index], index];
};

const deleteScheduledJob = () => {
  clearTimeout(currentSpinTimeout);
  currentSpinTimeout = null;
  currentSpinId = null;
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

initiateNextSpin();
// initiateSpinProcess();

// async function task(i) {
//   // 3
//   await timer(2000);
//   console.log(`Task ${i} done!`);
// }

// async function main() {
//   console.log("running");
//   for (let i = 0; i < 100; i += 10) {
//     // 1

//     // 2
//     await task(i);
//   }
// }

// main();
