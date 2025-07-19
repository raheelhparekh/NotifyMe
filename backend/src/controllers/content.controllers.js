import { Content } from "../models/Content.models.js";

const createTestContent = async (req, res) => {
  try {
    const { authorId, type, title, body } = req.body;
    if (!authorId || !type) {
      return res
        .status(400)
        .json({ message: "Author ID and Type are required" });
    }
    const newContent = await Content.create({
      author: authorId,
      type,
      title,
      body,
    });
    return res
      .status(201)
      .json({ message: "Content created successfully", content: newContent });
  } catch (error) {
    console.error("Error creating test content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTestContent,
};
