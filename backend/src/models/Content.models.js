import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["blog", "chat", "job"], required: true }, // e.g., 'blog', 'chat', 'job'
    title: { type: String },
    body: { type: String },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Content = mongoose.model("Content", contentSchema);
