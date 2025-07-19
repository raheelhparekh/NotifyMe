import mongoose, { Schema } from "mongoose";

const notificationSchema = Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
    }, // e.g., 'new_post', 'new_follower', 'content_liked'
    message: {
      type: String,
      required: true,
    },
    relatedContent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", notificationSchema);
