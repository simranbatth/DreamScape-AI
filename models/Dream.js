import mongoose from "mongoose";

const dreamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dreamText: {
      type: String,
      required: true,
    },

    aiResponse: {
      type: String,
      default: "",
    },

    mood: {
      type: String,
      default: "Unknown",
    },

    symbols: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Dream = mongoose.model("Dream", dreamSchema);

export default Dream;