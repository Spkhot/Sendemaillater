const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  condition: {
    type: String, // e.g. 'no_reply', 'reply_contains'
    required: true
  },
  daysAfter: Number, // for no_reply
  keyword: String,   // for reply_contains
  message: String,   // follow-up message
  subject: String    // follow-up subject
});

const smartScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientEmails: [{ type: String, required: true }],
  originalSubject: String,
  originalMessage: String,
  sendAt: Date,
  followUps: [followUpSchema],
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('SmartSchedule', smartScheduleSchema);
