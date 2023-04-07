const schedule = require("node-schedule");
const blogRepo = require("../../repository/blogs");
const campaignRepo = require("../../repository/campaignDetails");
const choresRepo = require("../../repository/chores");
const moment = require("moment");
const uuid = require("uuid");
const { NXML_BLOG_CAMPAIGN } = require("../../constants");
const { DATE_TIME_FORMAT } = require("../../constants/momentHelper");
const initiateProcess = async () => {};

initiateProcess();
schedule.scheduleJob("0 */1 * * *", async () => {
  await initiateProcess();
});
