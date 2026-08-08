export const authToken = process.env.AUTH_SECRET || "default-secret-key";

export const smtpUserEmail = process.env.SMTP_USER_EMAIL;
export const smtpSenderName = process.env.SMTP_SENDER_NAME;
export const smtpUserPassword = process.env.SMTP_USER_PASSWORD;
export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = process.env.SMTP_PORT;
export const environment = process.env.NODE_ENV || "development";