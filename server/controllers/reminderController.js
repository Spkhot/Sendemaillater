const Reminder = require('../models/Reminder');
const User = require('../models/User'); // To get user’s email for self-copy
const sendEmail = require('../services/emailService'); // Your email sender

// ✅ CREATE a new reminder
// ✅ CREATE a new reminder
exports.create = async (req, res) => {
  try {
    const { userId, recipientName, recipientEmails, subject, message, sendAt, repeat } = req.body;

    // 🗂️ Save reminder in DB — FIX repeat fallback!
    const reminder = await Reminder.create({
      userId,
      recipientName,
      recipientEmails,
      subject,
      message,
      sendAt,
      repeat: repeat && repeat.trim() !== '' ? repeat : 'none', // ✅ FIXED
      status: 'scheduled' // ✅ Be explicit!
    });

    res.json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET all reminders for a user
exports.getAll = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE a reminder
exports.delete = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ AI GENERATOR (stub — needs OpenAI setup)
exports.generateMessage = async (req, res) => {
  try {
    const { subject } = req.body;

    // This is just a placeholder. Replace with real OpenAI call.
    const generated = `Hello, here’s a nice message based on "${subject}".`;

    res.json({ generatedMessage: generated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate message.' });
  }
};

// ✅ CRON or background worker should handle sending emails + self-copy
exports.sendDueReminders = async () => {
  const now = new Date();
  const reminders = await Reminder.find({
    sendAt: { $lte: now },
    status: 'scheduled'
  });

  for (const reminder of reminders) {
    // 📧 Send to all recipients
    for (const email of reminder.recipientEmails) {
      await sendEmail({
        to: email,
        subject: reminder.subject,
        text: reminder.message
      });
    }

   // 📧 Also send copy to the user
    const user = await User.findById(reminder.userId);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `[Copy] ${reminder.subject}`,
        text: `Subject: ${reminder.subject}\n\nMessage:\n${reminder.message}`
      });
    }

    // ✅ Mark as sent
    reminder.status = 'sent';

    // ✅ If repeat, reschedule
    if (reminder.repeat && reminder.repeat !== 'none') {
      reminder.sendAt = getNextDate(reminder.sendAt, reminder.repeat);
      reminder.status = 'scheduled';
    }

    await reminder.save();
  }
};

function getNextDate(date, repeat) {
  const next = new Date(date);
  switch (repeat) {
    case 'daily': next.setDate(next.getDate() + 1); break;
    case 'weekly': next.setDate(next.getDate() + 7); break;
    case 'monthly': next.setMonth(next.getMonth() + 1); break;
    case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
  }
  return next;
}
