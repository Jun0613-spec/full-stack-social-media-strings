"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markNotificationAsRead = exports.getNotifications = void 0;
const prisma_1 = require("../lib/prisma");
const socket_1 = require("../lib/socket");
const getNotifications = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const notifications = await prisma_1.prisma.notification.findMany({
            where: {
                recipientId: userId
            }
        });
        if (notifications.length === 0) {
            res.status(404).json({ message: "No notifications found" });
            return;
        }
        res.status(200).json({ notifications });
    }
    catch (error) {
        console.log(error);
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const existingNotification = await prisma_1.prisma.notification.findUnique({
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
        const updatedNotification = await prisma_1.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        const io = (0, socket_1.getIO)();
        io.to(userId).emit("notificationMarkedAsRead", { notificationId });
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        console.error("markNotificationsAsRead error:", error);
        res.status(500).json({ message: "Failed to mark notifications as read" });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const notification = await prisma_1.prisma.notification.findUnique({
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
        await prisma_1.prisma.notification.delete({
            where: {
                id: notificationId
            }
        });
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        console.error("deleteNotification error:", error);
        res.status(500).json({ message: "Failed to delete notification" });
    }
};
exports.deleteNotification = deleteNotification;
