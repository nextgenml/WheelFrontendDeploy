const config = require("../config.js");
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
const logger = require("../logger.js");

let currentSpinTimeout = null;
let currentSpinId = null;

const initiateNextSpin = () => {
  let running = false;
  logger.info("spin process started");
  setInterval(async () => {
    try {
      if (running) return;
      running = true;

      const nextSpin = await nextSpinDetails();

      if (nextSpin) {
        // after scheduling a spin, if some update happens in the DB
        if (currentSpinId && currentSpinId !== nextSpin.id)
          deleteScheduledJob();

        if (!currentSpinTimeout) {
          const waitingTime = nextSpin.nextSpinAt.diff(moment(), "ms");

          currentSpinTimeout = setTimeout(
            () => createParticipants(nextSpin),
            waitingTime
          );
          currentSpinId = nextSpin.id;
          logger.info(
            `scheduled next spin cycle, ${JSON.stringify(
              nextSpin
            )}, ${waitingTime}`
          );
        }
      } else if (currentSpinTimeout) deleteScheduledJob();
      running = false;
    } catch (error) {
      logger.error(`error in initiateNextSpin: ${error}`);
    }
  }, 10000);
};

const createParticipants = async (nextSpin) => {
  try {
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
        logger.info(
          `there are no participants for ${nextSpin.id}, page: ${page}`
        );
        break;
      }

      if (nextSpin.type !== "daily" && nextSpin.type !== "adhoc") {
        const extraParticipants = await currSpinParticipants(
          (page + 1) * size,
          size,
          nextSpin
        );
        if (extraParticipants.length < config.MIN_WALLETS_COUNT) {
          currParticipants = [...currParticipants, ...extraParticipants];
        }
      }

      logger.info(`currParticipants length: ${currParticipants.length}`);

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
        await timer(nextSpin.spinDelay * 1000);
      }

      winners = await processWinners(currParticipants, nextSpin);

      await markSpinAsDone(spin.id);

      if (nextSpin.type === "daily" || nextSpin.type === "adhoc") break;

      nextSpin.spinNo += 1;
      page += currParticipants.length > size ? 2 : 1;
    }
    await processPrizes(winners);
    logger.info(`spin completed for a type: ${nextSpin.type}`);
  } catch (error) {
    logger.error(
      `error in createParticipants: ${error}, nextSpin: ${JSON.stringify(
        nextSpin
      )}`
    );
  }
};

const processWinners = async (group, nextSpin) => {
  const winners = [];
  try {
    for (let index = 1; index <= nextSpin.winnerPrizes.length; index += 1) {
      const rIndex = generateRandomNumber(group.length);
      const winner = group[rIndex];
      const prize = nextSpin.winnerPrizes[index - 1];
      logger.info(`winner: ${winner.id}, prize: ${prize}, ${index}`);
      await markAsWinner(winner.id, index, prize);
      winners.push({
        id: winner.id,
        prize: prize,
        walletId: winner.walletId,
      });

      group.splice(rIndex, 1);

      if (index != nextSpin.winnerPrizes.length) {
        logger.info("waiting in processWinners");
        await timer(nextSpin.spinDelay * 1000);
      }
    }
  } catch (error) {
    logger.error(
      `error in processWinners: ${group}, nextSpin: ${JSON.stringify(nextSpin)}`
    );
  }
  return winners;
};

const deleteScheduledJob = () => {
  clearTimeout(currentSpinTimeout);
  currentSpinTimeout = null;
  currentSpinId = null;
};
initiateNextSpin();
