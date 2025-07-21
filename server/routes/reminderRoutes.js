const router = require('express').Router();
const reminderController = require('../controllers/reminderController');

// ✅ Create new reminder (supports multiple recipients now)
router.post('/', reminderController.create);

// ✅ Get all reminders for a user
router.get('/all/:userId', reminderController.getAll);

// ✅ Delete a reminder
router.delete('/:id', reminderController.delete);

// ✅ (Optional) Add an AI generator route — you can wire this to OpenAI or another AI API
router.post('/generate', reminderController.generateMessage);

module.exports = router;
