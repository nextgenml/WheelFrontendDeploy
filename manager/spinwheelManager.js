const { MIN_WALLETS_COUNT } = require("../config.js");
const {
  createParticipant,
  markAsWinner,
} = require("../repository/spinwheel.js");

const { nextSpinDetails } = require("./scheduledSpinsManager.js");
const { createSpin, markSpinAsDone } = require("../repository/spin.js");
const moment = require("moment");
const { updateLaunchDate } = require("../repository/scheduledSpin.js");
const { currSpinParticipants } = require("../repository/wallet.js");
const { timer, generateRandomNumber } = require("../utils/index.js");
const { processPrizes } = require("./rewardTransfer.js");

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
      if (currentSpinId && currentSpinId !== nextSpin.id) deleteScheduledJob();

      if (!currentSpinTimeout) {
        const waitingTime = nextSpin.nextSpinAt.diff(moment(), "ms");

        currentSpinTimeout = setTimeout(
          () => createParticipants(nextSpin),
          waitingTime
        );
        currentSpinId = nextSpin.id;
        console.log("scheduled next spin cycle", nextSpin, waitingTime);
      }
    } else if (currentSpinTimeout) deleteScheduledJob();
    running = false;
  }, 1000);
};

const createParticipants = async (nextSpin) => {
  console.log("creating participants");
  let page = 0,
    size = 25;
  let winners = [];
  while (1) {
    let currParticipants = await currSpinParticipants(
      page * size,
      size,
      nextSpin
    );

    if (currParticipants.length === 0) {
      console.log("there are no participants for ", nextSpin.id, page);
      break;
    }

    if (nextSpin.type !== "daily" && nextSpin.type !== "adhoc") {
      const extraParticipants = await currSpinParticipants(
        (page + 1) * size,
        size,
        nextSpin
      );
      if (extraParticipants.length < MIN_WALLETS_COUNT) {
        currParticipants = [...currParticipants, ...extraParticipants];
      }
    }

    console.log("currParticipants length", currParticipants.length);

    const spin = await createSpin(nextSpin);

    for (const item of currParticipants) {
      const participant = await createParticipant(
        item.walletId,
        item.value,
        nextSpin
      );
      item["id"] = participant.insertId;
    }
    await updateLaunchDate(nextSpin.id);

    if (page != 0) {
      console.log("waiting in createParticipants");
      await timer(nextSpin.spinDelay * 1000);
    }

    winners = await processWinners(currParticipants, nextSpin);

    await markSpinAsDone(spin.id);

    if (nextSpin.type === "daily" || nextSpin.type === "adhoc") break;

    nextSpin.spinNo += 1;
    page += currParticipants.length > size ? 2 : 1;
  }
  await processPrizes(winners);
  console.log("spin completed for a type:", nextSpin.type);
};

const processWinners = async (group, nextSpin) => {
  const winners = [];
  for (let index = 1; index <= nextSpin.winnerPrizes.length; index += 1) {
    const rIndex = generateRandomNumber(group.length);
    const winner = group[rIndex];
    const prize = nextSpin.winnerPrizes[index - 1];
    console.log("winner", winner.id, prize, index);
    await markAsWinner(winner.id, index, prize);
    winners.push({
      id: winner.id,
      prize: prize,
      walletId: winner.walletId,
    });

    group.splice(rIndex, 1);

    if (index != nextSpin.winnerPrizes.length) {
      console.log("waiting in processWinners");
      await timer(nextSpin.spinDelay * 1000);
    }
  }
  return winners;
};

const deleteScheduledJob = () => {
  clearTimeout(currentSpinTimeout);
  currentSpinTimeout = null;
  currentSpinId = null;
};
initiateNextSpin();
