const { spin_hours, spin_minute, next_spin_delay } = require("../config.js");
const fetchAddress = require("../script/tracking");
const {
  dataExistsForCurrentSpin,
  createParticipant,
  currentSpinData,
  getSpin,
  updateSpin,
  getWinners,
  getParticipants,
  markAsWinner,
} = require("../repository/spinwheel.js");

function randomItemSetter() {
  let time_out = 1000 * 1; // 10 sec
  setInterval(async () => {
    try {
      let date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      // date.setSeconds(date.getSeconds() + 3) // Setting 3s offset, to generate the data 3s prior
      let seconds = date.getSeconds();
      if (spin_hours.indexOf(hours) >= 0) {
        if (minutes === spin_minute) {
          console.log("hit");

          const spin_no = spin_hours.indexOf(hours) + 1;
          spin_data_exists = dataExistsForCurrentSpin(spin_no);
          let currentSpin, today_spinner_data;
          if (!spin_data_exists) {
            const new_addresses = await fetchAddress();
            if (Object.keys(new_addresses).length === 0) {
              throw "No transactions for the period!";
            }
            console.log(new_addresses, "fresh day");
            currentSpin = await createSpin(spin_no);
            for (const item of new_addresses) {
              await createParticipant(item, spin_no);
            }
            today_spinner_data = {
              items: new_addresses,
              created_at: currentSpin.created_at,
              updated_at: currentSpin.updated_at,
            };
          } else {
            currentSpin = await getSpin(spin_no);
            today_spinner_data = await currentSpinData(spin_no);
          }
          if (today_spinner_data["items"].length < 6) {
            console.warn("Insufficient spinner items, length < 6");
            return;
          }

          let update_time = new Date(today_spinner_data["updated_at"]);

          if (!isNaN(update_time.getSeconds())) {
            if (
              update_time.getHours() === hours &&
              Math.abs(seconds - update_time.getSeconds()) >= next_spin_delay
            ) {
              await updateSpin(currentSpin.id);
              await updateWinners();
            } else if (update_time.getHours() !== hours) {
              //? Fetch data here for every 6 hours
              const new_addresses = await fetchAddress();
              if (Object.keys(new_addresses).length === 0) {
                throw "No transactions for the period!";
              }
              currentSpin = await createSpin(spin_no);
              for (const item of new_addresses) {
                await createParticipant(item, spin_no);
              }
              await updateWinners();
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, time_out);
}
updateWinners = async () => {
  let date = new Date();
  let hours = date.getHours();

  if (spin_hours.indexOf(hours) > -1) {
    const spin_no = spin_hours.indexOf(hours);
    const winners = await getWinners(date, date);
    const currentSpinRow = winners.filter((w) => w.spin === spin_no)[0];
    const currentSpin = await createSpin(spin_no);
    const participants = await getParticipants(date, date, "winners");
    if (!participants.length || !currentSpin) return;

    if (!currentSpinRow || !currentSpinRow.first) {
      const winner = pickWinner(participants);
      await markAsWinner(winner.id);
      await updateSpin(currentSpin.id);
    } else if (!currentSpinRow.second) {
      participants = participants.filter((p) => !p.first);
      const winner = pickWinner(participants);
      await markAsWinner(winner.id);
      await updateSpin(currentSpin.id);
    } else if (!currentSpinRow.third) {
      participants = participants.filter((p) => !p.first && !p.second);
      const winner = pickWinner(participants);
      await markAsWinner(winner.id);
      await updateSpin(currentSpin.id);
    }
  }
};
pickWinner = (participants) => {
  const size = participants.size;
  const index = Math.floor(Math.random() * size);
  return participants[index];
};

function stringToDate(date_str) {
  let date = new Date();
  let date_str_arr = date_str.split("/");
  date.setDate(parseInt(date_str_arr[0]));
  date.setMonth(parseInt(date_str_arr[1]) - 1);
  date.setFullYear(parseInt(date_str_arr[2]));

  return date;
}
function dateToString(date) {
  let d = date.getDate();
  let d_str = d.toString();
  if (d < 9) {
    d_str = "0" + d.toString();
  }
  return `${d_str}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getFormattedHash(hash) {
  return hash.splice(0, 5) + "..." + hash.substr(hash.length - 5);
}

module.exports = {
  dateToString,
  stringToDate,
  getFormattedHash,
  randomItemSetter,
};
