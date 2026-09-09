import Dream from "../models/Dream.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Add Dream with AI Analysis
export const addDream = async (req, res) => {
  try {
    const { dreamText } = req.body;

    if (!dreamText || !dreamText.trim()) {
      return res.status(400).json({
        message: "Please enter a dream.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
You are DreamScape AI, a friendly and thoughtful dream analyst.

Analyze the following dream and return:
1. A meaningful interpretation.
2. The overall emotional mood.
3. Important symbols from the dream.

Dream:
${dreamText}
`,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",
          properties: {
            aiResponse: {
              type: "string",
            },
            mood: {
              type: "string",
            },
            symbols: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },

          required: ["aiResponse", "mood", "symbols"],
        },
      },
    });

    const aiData = JSON.parse(response.text);

    const dream = await Dream.create({
      user: req.user.id,
      dreamText,
      aiResponse: aiData.aiResponse,
      mood: aiData.mood,
      symbols: aiData.symbols,
    });

    res.status(201).json({
      message: "Dream analyzed successfully 🌙",
      dream,
    });

  } catch (error) {
    console.error("Dream AI Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// Get User Dreams
export const getDreams = async (req, res) => {
  try {
    const dreams = await Dream.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(dreams);

  } catch (error) {
    console.error("Get Dreams Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};