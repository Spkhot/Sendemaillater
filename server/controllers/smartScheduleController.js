const SmartSchedule = require('../models/SmartSchedule');

exports.create = async (req, res) => {
  try {
    const { userId, recipientEmails, originalSubject, originalMessage, sendAt, followUps } = req.body;

    const schedule = await SmartSchedule.create({
      userId,
      recipientEmails,
      originalSubject,
      originalMessage,
      sendAt,
      followUps
    });

    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const schedules = await SmartSchedule.find({ userId: req.params.userId });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await SmartSchedule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
