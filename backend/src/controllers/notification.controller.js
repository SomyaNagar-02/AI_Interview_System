import Notification from "../models/notification.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/v1/notification
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 }); // Newest first

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

// PATCH /api/v1/notification/:id/read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await Notification.findByIdAndUpdate(id, { isRead: true });

  return res.status(200).json(
    new ApiResponse(200, {}, "Notification marked as read")
  );
});