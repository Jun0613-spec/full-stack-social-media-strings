import express from "express";

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from "../controllers/notifications.controller";

import verifyToken from "../middleware/verityToken";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:notificationId/read", verifyToken, markNotificationAsRead);
router.delete("/:notificationId", verifyToken, deleteNotification);
router.delete("/", verifyToken, deleteAllNotifications);

export default router;
