const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html,
    headers: { "x-mailer": `${process.env.APP_NAME} Mailer` },
  });
};

module.exports = sendEmail;
