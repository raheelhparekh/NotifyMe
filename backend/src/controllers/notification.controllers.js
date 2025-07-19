import { Notification } from "../models/Notification.models.js";
import { User } from "../models/User.models.js";
import { Content } from "../models/Content.models.js";
import mongoose from "mongoose";

const simulateActivity = async (req, res) => {
  try {
    const { activityType, actorId, targetId, contentId } = req.body;
    let notificationsToCreate = [];

    if (!activityType || !actorId) {
      return res
        .status(400)
        .json({ message: "Activity type and actor ID are required." });
    }

    if (actorId && !mongoose.Types.ObjectId.isValid(actorId)) {
      console.warn(`Invalid actorId: ${actorId}`);
      return res.status(400).json({ message: "Invalid actor ID format." });
    }
    if (targetId && !mongoose.Types.ObjectId.isValid(targetId)) {
      console.warn(`Invalid targetId: ${targetId}`);
      return res.status(400).json({ message: "Invalid target ID format." });
    }
    if (contentId && !mongoose.Types.ObjectId.isValid(contentId)) {
      console.warn(`Invalid contentId: ${contentId}`);
      return res.status(400).json({ message: "Invalid content ID format." });
    }

    const actor = await User.findById(actorId);
    // console.log("actor", actor);

    const target = await User.findById(targetId);
    // console.log("target", target);

    const content = await Content.findById(contentId);

    switch (activityType) {
      case "new_post":
        // Notify followers of the actor that post
        if (actor) {
          const followers = await User.find({ following: actor._id });
          for (const follower of followers) {
            notificationsToCreate.push({
              recipient: follower._id,
              sender: actor._id,
              type: "new_post",
              message: `${actor.username} posted new content.`,
              relatedContent: contentId,
            });
          }
          console.log(
            `Generated ${followers.length} notifications for new_post from ${actor.username}`,
          );
        } else {
          return res
            .status(404)
            .json({ message: "Actor not found for new_post activity." });
        }
        break;
      case "new_follower":
        // Notify the target user that they have a new follower
        if (actor && target) {
          // Update user 'following' and 'followers' arrays for proper relationship tracking
          if (!target.followers.includes(actor._id)) {
            target.followers.push(actor._id);
            await target.save();
          }
          if (!actor.following.includes(target._id)) {
            actor.following.push(target._id);
            await actor.save();
          }

          notificationsToCreate.push({
            recipient: target._id,
            sender: actor._id,
            type: "new_follower",
            message: `${actor.username} started following you.`,
          });
          console.log(
            `Generated notification for ${target.username} about new follower ${actor.username}`,
          );
        } else {
          return res.status(404).json({
            message: "Actor or Target not found for new_follower activity.",
          });
        }
        break;
      case "content_liked":
        // Notify the author of the content
        if (actor && content) {
          const contentAuthor = await User.findById(content.author);
          if (contentAuthor) {
            notificationsToCreate.push({
              recipient: contentAuthor._id,
              sender: actor._id,
              type: "content_liked",
              message: `${actor.username} liked your ${content.type}.`,
              relatedContent: contentId,
            });
            console.log(
              `Generated notification for ${contentAuthor.username} about like from ${actor.username}`,
            );

            // Update content likes count if needed
            if (!content.likes) {
              content.likes = 0;
            }
            content.likes++;
            await content.save();
          } else {
            return res.status(404).json({
              message: "Content author not found for content_liked activity.",
            });
          }
        } else {
          return res.status(404).json({
            message: "Actor or Content not found for content_liked activity.",
          });
        }
        break;
      default:
        console.log(`Unknown activity type: ${activityType}`);
        return res.status(400).json({ message: "Unknown activity type." });
    }

    // Save generated notifications to the database
    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    return res
      .status(200)
      .json({ message: "Activity simulated and notifications processed." });
  } catch (error) {
    console.error("Error simulating activity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("relatedContent", "title type")
      .lean();

    console.log("Notifications fetched:", notifications);

    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        message: "Notification ID is required.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res
        .status(400)
        .json({ message: "Invalid Notification ID format." });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );

    if (!updatedNotification) {
      return res.status(404).json({
        message: "Notification not found or already marked as read.",
      });
    }

    return res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export { simulateActivity, getUserNotifications, markNotificationRead };
