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

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dreams", dreamRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "DreamScape AI Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});