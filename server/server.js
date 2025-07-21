// server.js (or index.js)
require('dotenv').config();           // Load environment variables first
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const generateRoutes = require('./routes/generateRoutes');
const path = require('path');

// ✅ Initialize DB & Scheduler
require('./db/connection');           // Connect MongoDB
require('./services/scheduler');      // Start cron jobs

const authRoutes = require('./routes/authRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reminder', reminderRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/timetable', require('./routes/timetableRoutes'));

// ✅ Global error handler (optional, good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
