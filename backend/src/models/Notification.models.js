import mongoose, { Schema } from "mongoose";

const notificationSchema = Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: who triggered it
    type: { type: String, required: true }, // e.g., 'new_post', 'new_follower', 'content_liked'
    message: { type: String, required: true },
    relatedContent: { type: mongoose.Schema.Types.ObjectId, ref: "Content" }, // Optional: if notification relates to content
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", notificationSchema);
