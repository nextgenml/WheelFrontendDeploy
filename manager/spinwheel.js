const config = require("../config/env.js");
const {
  createParticipant,
  markAsWinner,
  markWinnerAsPaid,
} = require("../repository/spinwheel.js");

const { nextSpinDetails } = require("./scheduledSpins.js");
const { createSpin, markSpinAsDone } = require("../repository/spin.js");
const moment = require("moment");
const {
  updateLaunchDate,
  recentUpdatedAt,
} = require("../repository/scheduledSpin.js");
const { currSpinParticipants } = require("../repository/wallet.js");
const { timer, generateRandomNumber } = require("../utils/index.js");
const logger = require("../logger.js");
const { processPrizesV1 } = require("./rewardTransferV1.js");
const participantsRepo = require("../repository/spinParticipants.js");
const blogsRepo = require("../repository/blogs.js");
const { hasPostedValidBlogs } = require("./blogs.js");
const { DATE_TIME_FORMAT } = require("../constants/momentHelper.js");

let currentSpinTimeout = null;
let currentSpinId = null;
let lastUpdatedAt = null;
const initiateNextSpin = () => {
  let running = false;
  logger.info("spin process started");
  setInterval(async () => {
    try {
      if (running) return;
      running = true;

      const nextSpin = await nextSpinDetails();

      if (nextSpin) {
        const updateAt = await recentUpdatedAt();
        // console.log("updateAt", updateAt, lastUpdatedAt);
        // after scheduling a spin, if some update happens in the DB
        if (
          (currentSpinId && currentSpinId !== nextSpin.id) ||
          updateAt != lastUpdatedAt
        )
          deleteScheduledJob();

        if (!currentSpinTimeout) {
          const waitingTime = nextSpin.nextSpinAt.diff(moment(), "ms");

          currentSpinTimeout = setTimeout(
            () => createParticipants(nextSpin),
            waitingTime
          );
          currentSpinId = nextSpin.id;
          lastUpdatedAt = moment(updateAt).format(DATE_TIME_FORMAT);
          logger.info(
            `scheduled next spin cycle, ${JSON.stringify(nextSpin)}, ${
              waitingTime / 1000
            } sec`
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

      // console.log("currParticipants", currParticipants);
      if (currParticipants.length <= config.MIN_WALLETS_COUNT) {
        logger.info(
          `there are no participants for ${nextSpin.id}, of type ${nextSpin.type}, page: ${page}, insufficient participants: ${currParticipants.length}`
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

      logger.info(
        `Running spin for ${nextSpin.type} with ${currParticipants.length} participants`
      );

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

      await markSpinAsDone(spin?.id);

      if (nextSpin.type === "daily" || nextSpin.type === "adhoc") break;

      nextSpin.spinNo += 1;
      page += currParticipants.length > size ? 2 : 1;
    }
    await processPrizesV1(
      winners,
      nextSpin.currency,
      async (id) => await markWinnerAsPaid(id)
    );
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
      logger.info(`winner: ${winner.id}, prize: ${prize}, rank: ${index}`);
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
  logger.info("clearing scheduled job because of new next spin");
  clearTimeout(currentSpinTimeout);
  currentSpinTimeout = null;
  currentSpinId = null;
};
initiateNextSpin();

const getNextSpinEligibleUsers = async () => {
  const lastSpinAt = await participantsRepo.lastSpinAt();

  const bloggers = await blogsRepo.uniqueBloggersSince(lastSpinAt);

  const result = [];

  for (const blogger of bloggers) {
    if (await hasPostedValidBlogs(blogger.wallet_address, lastSpinAt)) {
      result.push(blogger);
    }
  }

  return result;
};
module.exports = {
  getNextSpinEligibleUsers,
};
