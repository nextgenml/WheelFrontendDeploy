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
  createSpin,
  markAsWinner,
} = require("../repository/spinwheel.js");

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
initiateSpinProcess();
