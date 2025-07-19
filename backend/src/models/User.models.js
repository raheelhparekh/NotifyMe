import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who follow this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users this user follows
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
