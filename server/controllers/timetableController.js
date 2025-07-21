const Timetable = require('../models/Timetable');

exports.create = async (req, res) => {
  try {
    const { userId, studentName, studentEmails, entries, frequency, intervalDays } = req.body;

    const timetable = await Timetable.create({
      userId,
      studentName,
      studentEmails,
      entries,
      frequency,
      intervalDays
    });

    res.json(timetable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const timetables = await Timetable.find({ userId: req.params.userId });
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
