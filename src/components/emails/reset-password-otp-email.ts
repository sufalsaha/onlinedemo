export function resetPasswordOTPEmail({
  firstName,
  otp,
}: {
  firstName: string;
  otp: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 20px 30px;
      text-align: left;
    }
    .content p {
      margin: 0 0 15px;
      font-size: 16px;
    }
    .otp-box {
      display: inline-block;
      background-color: #f9f9f9;
      border: 1px dashed #4CAF50;
      padding: 10px 20px;
      font-size: 28px;
      font-weight: bold;
      color: #4CAF50;
      letter-spacing: 2px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f9f9f9;
      text-align: center;
      padding: 15px 20px;
      font-size: 12px;
      color: #888888;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; color: transparent; height: 0; width: 0; max-height: 0; max-width: 0;">
      Welcome to ScrapeFollowers
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      <p>Please use the code below to complete reset password process.</p>
      <div class="otp-box">${otp}</div>
      <p>The code is valid for 10 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Best regards,<br>ScrapeFollowers</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing ScrapeFollowers!</p>
    </div>
  </div>
</body>
</html>
`;
}
