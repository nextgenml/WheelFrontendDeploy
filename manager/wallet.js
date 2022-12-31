const config = require("../config.js");
const logger = require("../logger.js");
const { createHolder } = require("../repository/holder.js");
const { createWallet } = require("../repository/wallet.js");
const fetchAddress = require("../script/tracking.js");

const fetchDataFromContract = () => {
  let running = false;
  let lastFetchedCycle = -1;
  setInterval(async () => {
    if (running) return;
    running = true;
    const date = new Date();

    try {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const index = config.FETCH_HOURS.indexOf(hours);
      if (
        lastFetchedCycle != index &&
        index > -1 &&
        minutes === config.FETCH_MINUTE
      ) {
        const new_addresses = await fetchAddress();
        logger.info(
          `successfully fetched data at: ${date.toDateString()}, new_addresses: ${JSON.stringify(
            new_addresses
          )}`
        );
        for (const item of new_addresses) {
          const value =
            parseInt(item[1].toString().substring(0, item[1].length - 18)) || 0;
          await createWallet(item[0], value, date);
          await createHolder(item[0], value);
        }
        lastFetchedCycle = index;
      }
    } catch (err) {
      logger.error(
        `error fetching wallet at ${date.toDateString()}, err: ${err}`
      );
    }
    running = false;
  }, 10000);
};

fetchDataFromContract();
