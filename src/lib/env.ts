// Sessions are signed with this key. A fallback default would mean anyone who
// read the source could forge a session cookie, so fail loudly instead.
if (!process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env",
  );
}

export const authToken = process.env.AUTH_SECRET;

export const smtpUserEmail = process.env.SMTP_USER_EMAIL;
export const smtpSenderName = process.env.SMTP_SENDER_NAME;
export const smtpUserPassword = process.env.SMTP_USER_PASSWORD;
export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = process.env.SMTP_PORT;
export const environment = process.env.NODE_ENV || "development";