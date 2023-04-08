const schedule = require("node-schedule");
const choresRepo = require("../../repository/chores");
const { createValidationChore } = require("../chores");

const initiateProcess = async () => {
  const chores = await choresRepo.unValidatedChores();
  for (const chore of chores) {
    console.log("reassigning chore", chore.id);
    await createValidationChore(chore.ref_chore_id);
  }
};

// initiateProcess();
schedule.scheduleJob("0 1 */1 * *", async () => {
  await initiateProcess();
});
