const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const emailTemplates = {
  "account-verification": path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    "account-verification.ejs"
  ),
  "profile-update-verification": path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    "profile-update-verification.ejs"
  ),
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendEmail(to, subject, { template, data, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured.");
  }

  const templatePath = emailTemplates[template];

  if (!templatePath) {
    throw new Error(`Unknown email template: ${template}`);
  }

  const html = await ejs.renderFile(templatePath, data);

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };
