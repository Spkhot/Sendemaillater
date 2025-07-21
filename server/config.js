require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'fallbacksecret',
  emailUser: process.env.EMAIL_USER,  // ✅
  emailPass: process.env.EMAIL_PASS,  // ✅
  adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
  geminiApiKey: process.env.GEMINI_API_KEY
};
