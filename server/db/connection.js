const mongoose = require('mongoose');
const config = require('../config');

// 🗄️ Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // 💥 Exit if DB fails to connect
  });

// 📌 Optional: Handle lost connections after startup
mongoose.connection.on('disconnected', () => {
  console.warn("⚠️ MongoDB disconnected!");
});
