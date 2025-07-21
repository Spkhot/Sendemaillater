const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

// ✅ Create Gemini client with your API key
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

exports.generateMessage = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject || subject.trim() === "") {
      return res.status(400).json({ error: "Subject is required" });
    }

    // ✅ Get model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ✅ Build your prompt
    const prompt = `Write a short, friendly, clear email message for this subject: "${subject}". Keep it professional but warm.`;

    // ✅ Generate
    const result = await model.generateContent(prompt);

    // ✅ Get the AI text
    const text = result.response.text();

    // ✅ Return to client
    res.json({ generatedMessage: text });

  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Failed to generate with Gemini." });
  }
};
