import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const emailTemplates = {
  "account-verification": path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    "account-verification.ejs",
  ),
  "profile-update-verification": path.join(
    __dirname,
    "..",
    "templates",
    "emails",
    "profile-update-verification.ejs",
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

class EmailDeliveryError extends Error {
  constructor(message, emailStatus, cause) {
    super(message);
    this.name = "EmailDeliveryError";
    this.code = "EMAIL_DELIVERY_FAILED";
    this.emailStatus = emailStatus;
    this.cause = cause;
  }
}

async function sendEmail(to, subject, { template, data, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured.");
  }

  const templatePath = emailTemplates[template];

  if (!templatePath) {
    throw new Error(`Unknown email template: ${template}`);
  }

  const html = await ejs.renderFile(templatePath, data);

  let info;
  try {
    info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new EmailDeliveryError(
      "Couldn't confirm whether the mail server accepted the email.",
      "unknown",
      error
    );
  }

  if (!info.accepted?.length) {
    throw new EmailDeliveryError(
      "The mail server rejected the recipient.",
      "rejected"
    );
  }

  return {
    accepted: info.accepted,
    rejected: info.rejected,
    messageId: info.messageId,
  };
}

export { EmailDeliveryError, sendEmail };
