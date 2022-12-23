const config = require("../config.js");
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
        console.log(
          "successfully fetched data at",
          date.toDateString(),
          new_addresses
        );
        for (const item of new_addresses) {
          const value = item[1].toString().substring(0, item[1].length - 18);
          await createWallet(item[0], value, date);
        }
        lastFetchedCycle = index;
      }
    } catch (err) {
      console.error("error fetching wallet at", date.toDateString(), err);
    }
    running = false;
  }, 1000);
};

fetchDataFromContract();
