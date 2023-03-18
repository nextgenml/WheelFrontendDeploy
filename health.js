const { sendEmail } = require("./utils/mailer");
const { runQueryAsync } = require("./utils/spinwheelUtil");

const checkResource = async () => {
  try {
    await runQueryAsync("select 1 from wallets;");
  } catch (error) {
    await sendEmail(error.message, JSON.stringify(error));
  }
};
setInterval(() => {
  checkResource();
}, 60000);
