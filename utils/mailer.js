const nodemailer = require("nodemailer");
const logger = require("../logger");

const sendEmail = async (subject, body) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.NEXGEN_MAIL,
      pass: process.env.NEXGEN_MAIL_PASS,
    },
  });

  try {
    return await transporter.sendMail({
      from: process.env.NEXGEN_MAIL,
      to: process.env.NEXGEN_MAIL,
      subject,
      html: body,
    });
  } catch (error) {
    logger.error(`Error sending email: error: ${error}, subject: ${subject}`);
  }
};

module.exports = {
  sendEmail,
};
