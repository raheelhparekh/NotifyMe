import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    // Add other user fields as needed for notification logic (e.g., interests, followers array)
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who follow this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users this user follows
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
