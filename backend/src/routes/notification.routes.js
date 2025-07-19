import express from "express";
import {
  simulateActivity,
  getUserNotifications,
  markNotificationRead,
} from "../controllers/notification.controllers.js";
const notificationRoutes = express.Router();

notificationRoutes.post("/simulate-activity", simulateActivity);

notificationRoutes.get("/:userId", getUserNotifications);

notificationRoutes.patch("/:notificationId/read", markNotificationRead);

export default notificationRoutes;
