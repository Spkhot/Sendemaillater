const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  recipientName: { 
    type: String, 
    required: true 
  },
  recipientEmails: [{ 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  }], // ✅ Ensures emails are clean
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  sendAt: { 
    type: Date, 
    required: true 
  },
  repeat: { 
    type: String, 
    enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'], 
    default: 'none' 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'sent'], 
    default: 'scheduled' 
  }
}, {
  timestamps: true // ✅ Adds createdAt + updatedAt
});

module.exports = mongoose.model('Reminder', reminderSchema);
