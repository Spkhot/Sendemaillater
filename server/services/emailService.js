// services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config');

// ✅ Create transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.emailUser,
    pass: config.emailPass // ✅ Must be an *App Password* if using Gmail!
  }
});

// ✅ Send a single email or batch
/**
 * Send an email
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.from]
 */
async function sendEmail({ to, subject, text, from }) {
  const mailOptions = {
    from: from || config.emailUser,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`❌ Email failed for ${to}:`, err);
    throw err; // Let scheduler.js handle it
  }
}

module.exports = sendEmail;
