import express from "express";

import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead
} from "../controllers/notifications.controller";

import verifyToken from "../middleware/verityToken";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.patch("/:notificationId/read", verifyToken, markNotificationAsRead);
router.delete("/:notificationId", verifyToken, deleteNotification);

export default router;
