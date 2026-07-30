import Dream from "../models/Dream.js";
import openai from "../config/openai.js";


// Add Dream with AI Analysis
export const addDream = async (req, res) => {
  try {
    const { dreamText } = req.body;


    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a dream analyst. Analyze dreams and return JSON with aiResponse, mood, and symbols."
        },
        {
          role: "user",
          content: `
Analyze this dream:

${dreamText}

Return only JSON:
{
 "aiResponse": "",
 "mood": "",
 "symbols": []
}
`
        }
      ],
      response_format: {
        type: "json_object"
      }
    });


    const aiData = JSON.parse(
      response.choices[0].message.content
    );


    const dream = await Dream.create({
      user: req.user.id,
      dreamText,
      aiResponse: aiData.aiResponse,
      mood: aiData.mood,
      symbols: aiData.symbols
    });


    res.status(201).json({
      message: "Dream analyzed successfully 🌙",
      dream
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
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

    res.status(500).json({
      message: error.message,
    });

  }
};