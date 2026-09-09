import "dotenv/config";

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dreamRoutes from "./routes/dreamRoutes.js";
console.log(
  "GEMINI KEY:",
  process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌"
);

console.log(
  "GEMINI KEY LENGTH:",
  process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY.length
    : 0
);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dreams", dreamRoutes);


// 🧪 TEMPORARY GEMINI TEST ROUTE
app.get("/api/test-gemini", async (req, res) => {
  try {
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
                  text: "Say hello in one sentence",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI TEST:", data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error("GEMINI TEST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


app.get("/", (req, res) => {
  res.json({
    message: "DreamScape AI Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});