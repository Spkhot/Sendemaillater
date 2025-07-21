// models/Timetable.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  studentName: { type: String, required: true },
  studentEmails: [{ type: String, required: true }],
  entries: [
    {
      subject: String,
      timeStart: String,
      message: String
    }
  ],
  frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
  intervalDays: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
