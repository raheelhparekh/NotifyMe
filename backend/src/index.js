import express from "express";
import cors from "cors";
import connectDb from "./utils/db.js";
import dotenv from "dotenv";
import app from "./app.js";

import notificationRoutes from "./routes/notification.routes.js";

dotenv.config({
  path: "./.env",
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/v1/notifications", notificationRoutes);

const PORT = process.env.PORT || 8000;
connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));
  })
  .catch((err) => {
    console.error("mongo db connection error", err);
    process.exit(1);
  });



