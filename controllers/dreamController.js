import Dream from "../models/Dream.js";

// Add Dream with AI Analysis
export const addDream = async (req, res) => {
  try {
    const { dreamText } = req.body;

    if (!dreamText || !dreamText.trim()) {
      return res.status(400).json({
        message: "Please enter a dream.",
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are DreamScape AI, a friendly and thoughtful dream analyst.

Analyze the following dream and return:
1. A meaningful interpretation.
2. The overall emotional mood.
3. Important symbols from the dream.

Dream:
${dreamText}
`,
                },
              ],
            },
          ],

          generationConfig: {
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
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return res.status(500).json({
        message:
          data?.error?.message || "Gemini API request failed",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({
        message: "Gemini returned an empty response.",
      });
    }

    const aiData = JSON.parse(text);

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