const nodemailer = require('nodemailer');
require('dotenv').config();

let cachedTransporter;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT) {
    console.warn('[mailer] SMTP not configured (missing SMTP_HOST/SMTP_PORT). Emails will be skipped.');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE || '').toLowerCase() === 'true' || Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return cachedTransporter;
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, reason: 'SMTP_NOT_CONFIGURED' };
  }

  const from = process.env.FROM_EMAIL || 'dinukakavinda3557@gmail.com';
  const fromName = process.env.FROM_NAME || 'KandyPack Notifications';

  try {
    const info = await transporter.sendMail({
      from: `${fromName} <${from}>`,
      to,
      subject,
      text,
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[mailer] send error:', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendEmail };
