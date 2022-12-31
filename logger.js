const { createLogger, transports, format } = require("winston");
const config = require("./config");

const customFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase()}] - ${
      info.message
    }`;
  })
);
const logger = createLogger({
  level: "debug",
  format: customFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: `logs/app.log` }),
  ],
  silent: config.DISABLE_LOGS,
});

module.exports = logger;
