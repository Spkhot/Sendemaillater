const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const sendEmail = require('./emailService');
const Timetable = require('../models/Timetable');
const SmartSchedule = require('../models/SmartSchedule');

cron.schedule('* * * * *', async () => {
  console.log('⏰ Checking Smart Schedules...');

  const now = new Date();
  const schedules = await SmartSchedule.find({ status: 'active' });

  for (const sched of schedules) {
    for (const rule of sched.followUps) {
      let shouldSend = false;

      if (rule.condition === 'no_reply') {
        const daysSince = (now - sched.sendAt) / (1000 * 60 * 60 * 24);
        if (daysSince >= rule.daysAfter) shouldSend = true;
      }
      // For reply_contains, you’d check your replies storage — skip for now.

      if (shouldSend) {
        for (const email of sched.recipientEmails) {
          await sendEmail({
            to: email,
            subject: rule.subject,
            text: rule.message
          });
        }

        sched.status = 'completed';
        await sched.save();
      }
    }
  }
});


cron.schedule('* * * * *', async () => {
  console.log("⏰ Checking timetables...");

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon...
  const currentTime = now.toTimeString().slice(0,5); // "HH:MM"

  const timetables = await Timetable.find({ status: 'active' });

  for (const table of timetables) {
    let frequencyMatch = false;

    if (table.frequency === 'daily') frequencyMatch = true;
    else if (table.frequency === 'weekly' && day === 1) frequencyMatch = true; // example: Monday
    else if (table.frequency === 'custom') {
      const diff = (now - table.createdAt) / (1000 * 60 * 60 * 24);
      if (Math.floor(diff) % table.intervalDays === 0) frequencyMatch = true;
    }

    if (frequencyMatch) {
      for (const entry of table.entries) {
        if (entry.timeStart === currentTime) {
          console.log(`⏰ Match found: ${entry.subject} for ${table.studentName}`);

          for (const email of table.studentEmails) {
            await sendEmail({
              to: email,
              subject: `📚 ${entry.subject}`,
              text: `Hi ${table.studentName},\n\n${entry.message}\n\nStart Time: ${entry.timeStart}`
            });
          }
        }
      }
    }
  }
});
// Run every minute
cron.schedule('* * * * *', async () => {
  console.log("⏰ Checking for scheduled emails...");

  const now = new Date();
  const reminders = await Reminder.find({
    sendAt: { $lte: now },
    status: 'scheduled'
  });

  for (const reminder of reminders) {
    console.log(`📌 Sending reminder: ${reminder.subject}`);

    try {
      // Send to all recipients
      // const recipients = reminder.recipientEmails || [];
      // for (const email of recipients) {
      //   await sendEmail({
      //     to: email,
      //     subject: reminder.subject,
      //     text: reminder.message
      //   });
      // }

      // Send copy to user
      const user = await User.findById(reminder.userId);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `${reminder.subject}`,
          text: `Hello :\n\n${reminder.message}`
        });
      }

      // ✅ Update status
      if (reminder.repeat && reminder.repeat !== 'none') {
        reminder.sendAt = getNextDate(reminder.sendAt, reminder.repeat);
        reminder.status = 'scheduled';
      } else {
        reminder.status = 'sent';
      }

      await reminder.save();
      console.log(`✅ Reminder processed: ${reminder.subject}`);

    } catch (err) {
      console.error(`❌ Failed to send reminder: ${reminder.subject}`, err);
      // Optional: maybe add a `failedAttempts` field, so you can track
    }
  }
});

function getNextDate(date, repeat) {
  const next = new Date(date);
  switch (repeat) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

console.log("✅ Scheduler is running!");
