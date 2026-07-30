import express from "express";
import { addDream, getDreams } from "../controllers/dreamController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Add new dream
router.post("/", protect, addDream);

// Get all user dreams
router.get("/", protect, getDreams);

export default router;