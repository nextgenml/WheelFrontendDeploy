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
initiateNextSpin();
