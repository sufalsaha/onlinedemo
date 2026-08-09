import nodemailer from "nodemailer";
import {
  smtpHost,
  smtpPort,
  smtpSenderName,
  smtpUserEmail,
  smtpUserPassword,
} from "@/lib/env";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort != undefined ? +smtpPort : undefined,
  secure: true,
  auth: {
    user: smtpUserEmail,
    pass: smtpUserPassword,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const options = {
    from: `${smtpSenderName} <${smtpUserEmail}>`,
    to: to,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(options);
}
