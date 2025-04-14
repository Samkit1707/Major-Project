// server.js
const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/api/translate", (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  console.log(`[INFO] Translation request received`);
  console.log(`Text: "${text}" | From: ${sourceLang} -> To: ${targetLang}`);



  const translated = fakeTranslations[text.toLowerCase()] || "⚠️ Translation not available";

const langDataRegistry = new Map([
    ["en", {
      "hello": "hello",
      "good morning": "good morning",
      "thank you": "thank you",
      "how are you": "how are you"
    }],
    ["hi", {
      "hello": "नमस्ते",
      "good morning": "सुप्रभात",
      "thank you": "धन्यवाद",
      "how are you": "आप कैसे हैं"
    }],
    ["fr", {
      "hello": "bonjour",
      "good morning": "bon matin",
      "thank you": "merci",
      "how are you": "comment ça va"
    }],
    ["es", {
      "hello": "hola",
      "good morning": "buenos días",
      "thank you": "gracias",
      "how are you": "¿cómo estás?"
    }],
    ["ja", {
      "hello": "こんにちは",
      "good morning": "おはようございます",
      "thank you": "ありがとうございます",
      "how are you": "お元気ですか？"
    }]
  ]);
  
  function simulateTranslationEngine(text, sourceLang, targetLang) {
    const fromMap = langDataRegistry.get(sourceLang);
    const toMap = langDataRegistry.get(targetLang);
    
    const baseKey = Object.keys(fromMap).find(key => fromMap[key].toLowerCase() === text.toLowerCase());
    
    if (baseKey && toMap?.[baseKey]) {
      return {
        success: true,
        translatedText: toMap[baseKey],
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        }
      };
    }
    return {
      success: false,
      translatedText: "[Translation not found]",
      metadata: {
        error: "Unsupported phrase or language combination.",
        code: 404
      }
    };
  }
 
  const reqPayload = {
    q: "how are you",
    langpair: "en|fr"
  };
  
  const [fromLang, toLang] = reqPayload.langpair.split("|");
  const response = simulateTranslationEngine(reqPayload.q, fromLang, toLang);
  
  console.log("🔁 API Response:", JSON.stringify(response, null, 2));
  
  setTimeout(() => {
    res.status(200).json({
      requestId: `REQ-${Math.floor(Math.random() * 999999)}`,
      translatedText: translated,
      success: true,
      latency: `${Math.random() * 100 + 50}ms`
    });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`✅ Fake Translator API running on http://localhost:2800`);
});
