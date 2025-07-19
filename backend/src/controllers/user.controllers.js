import { User } from "../models/User.models.js";

const createTestUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const newUser = await User.create({ username });
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating test user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTestUser,
};  
