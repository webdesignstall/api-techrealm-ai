import sgMail from '@sendgrid/mail';
import config from '../config';
export const sendOtp = (
  email: string,
  subject: string,
  otp: string,
  expire: string
) => {
  sgMail.setApiKey(config.sendGrid_key as string);
  const mailOptions = {
    to: email,
    from: `${config.app_name} <${config.sendGrid_email_from}>`,
    subject: subject,
    html: generateOtpEmailBody(otp, expire),
  };

  return sgMail.send(mailOptions);
};

function generateOtpEmailBody(otp: string, expireTime: string) {
  return `
    <html lang="en">
    <head>
      <title></title>
    </head>
    <body>
      <h2>${config.app_name} - OTP Verification</h2>
      <p>Hello,</p>
      <p>Your OTP for verification is: <strong style="color: forestgreen; margin-left: 0.5rem">${otp}</strong></p>
      <p>This OTP will expire in ${expireTime} minutes.</p>
      <p>Thank you for using ${config.app_name}!</p>
      <p>Best regards,<br>${config.app_name} Team</p>
    </body>
    </html>
  `;
}

export const sendPasswordSetMail = (
  email: string,
  subject: string,
  token: string,
  expire: string
) => {
  sgMail.setApiKey(config.sendGrid_key as string);
  const mailOptions = {
    to: email,
    from: `${config.app_name} <${config.sendGrid_email_from}>`,
    subject: subject,
    html: verifyEmailBody(token, expire),
  };

  return sgMail.send(mailOptions);
};

function verifyEmailBody(token: string, expireTime: string) {
  return `
    <html lang="en">
    <head>
      <title></title>
    </head>
    <body>
      <h2>${config.app_name} - Set New Password</h2>
      <p>Hello,</p>
      <p>Your new password set link is: <p><a href="${process.env.PASSWORD_SET_URL}?token=${token}" style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Set Password</a><p/></p><p>This Link will expire in ${expireTime}.</p><p>Thank you for using ${config.app_name}!</p><p>Best regards,<br>${config.app_name} Team</p>
    </body>
    </html>
  `;
}
