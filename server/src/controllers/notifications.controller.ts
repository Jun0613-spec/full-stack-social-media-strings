import { Request, Response } from "express";

import { prisma } from "../lib/prisma";

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        sender: true,
        like: {
          include: {
            post: true,
            reply: true
          }
        },
        reply: {
          include: {
            post: true
          }
        },
        follow: {
          include: {
            follower: true
          }
        }
      }
    });

    if (notifications.length === 0) {
      res.status(404).json({ message: "No notifications found" });
      return;
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!existingNotification || existingNotification.recipientId !== userId) {
      res
        .status(404)
        .json({ message: "Notification not found or access denied" });
      return;
    }

    if (existingNotification.isRead) {
      res.status(200).json({ message: "Notification already marked as read" });
      return;
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: true
      }
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("markNotificationsAsRead error:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId
      }
    });

    if (!notification || notification.recipientId !== userId) {
      res
        .status(404)
        .json({ message: "Notification not found or access denied" });
      return;
    }

    await prisma.notification.delete({
      where: {
        id: notificationId
      }
    });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("deleteNotification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

export const deleteAllNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { notificationId } = req.params;

  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await prisma.notification.deleteMany({
      where: {
        recipientId: userId
      }
    });

    res.status(200).json({ message: "All notifications deleted." });
  } catch (error) {
    console.error("deleteAllNotifications error:", error);
    res.status(500).json({ message: "Failed to delete all notifications" });
  }
};
