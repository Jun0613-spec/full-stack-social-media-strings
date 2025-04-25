import { Server } from "socket.io";
import http from "http";

import { Notification } from "@prisma/client";

import { prisma } from "./prisma";

let io: Server;

const connectedUsers: Record<string, string[]> = {};

const socket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL!,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes recovery window
      skipMiddlewares: true
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    if (!connectedUsers[userId]) {
      connectedUsers[userId] = [];
    }

    connectedUsers[userId].push(socket.id);

    console.log(
      `User ${userId} now has ${connectedUsers[userId].length} connections`
    );

    socket.on("sendNotification", async (notification: Notification) => {
      const recipientId = notification.recipientId;
      const recipientSocketId = connectedUsers[recipientId];

      try {
        const savedNotification = await prisma.notification.create({
          data: notification
        });

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNotification", savedNotification);
        }

        console.log(`Notification sent to user ${recipientId}`);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    socket.on("markNotificationAsRead", async (notificationId: string) => {
      try {
        const notification = await prisma.notification.findUnique({
          where: { id: notificationId }
        });

        if (!notification) {
          socket.emit("error", "Notification not found");
          return;
        }

        if (notification.recipientId !== userId) {
          socket.emit(
            "error",
            "You can only mark your own notifications as read"
          );
          return;
        }

        const updatedNotification = await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true },
          select: { id: true, recipientId: true, isRead: true }
        });

        socket.emit("notificationMarkedAsRead", updatedNotification);

        io.to(updatedNotification.recipientId).emit(
          "notificationMarkedAsRead",
          updatedNotification
        );

        console.log(
          `Notification ${notificationId} marked as read for user ${userId}`
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
        socket.emit("error", "Failed to mark notification as read");
      }
    });

    socket.on("sendMessage", async (message) => {
      const conversationId = message.conversationId;
      const recipientIds = message.recipients;

      recipientIds.forEach((recipientId: string) => {
        if (connectedUsers[recipientId]) {
          io.to(connectedUsers[recipientId]).emit("newMessage", message);
        }
      });

      console.log(`Message sent to conversation ${conversationId}`);
    });

    socket.on("sendConversation", async (conversation) => {
      const recipientIds = conversation.participants;

      recipientIds.forEach((recipientId: string) => {
        if (connectedUsers[recipientId]) {
          io.to(connectedUsers[recipientId]).emit(
            "newConversation",
            conversation
          );
        }
      });

      console.log(`New conversation created with participants ${recipientIds}`);
    });

    socket.on("markMessagesAsSeen", async (conversationId) => {
      const recipientSocketIds = connectedUsers[userId];

      if (recipientSocketIds) {
        io.to(recipientSocketIds).emit("messagesSeen", { conversationId });
        console.log(
          `Messages marked as seen for conversation ${conversationId}`
        );
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);

      if (userId) {
        connectedUsers[userId] = connectedUsers[userId].filter(
          (id) => id !== socket.id
        );

        if (connectedUsers[userId].length === 0) {
          delete connectedUsers[userId];
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

export default socket;
