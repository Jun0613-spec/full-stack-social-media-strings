import { Server } from "socket.io";
import http from "http";

import { Notification, Message } from "@prisma/client";

let io: Server;

const connectedUsers: Record<string, string[]> = {};

export const getReceiverSocketIds = (userId: string): string[] | undefined => {
  return connectedUsers[userId];
};

export const emitNotification = (
  userId: string,
  notification: Notification
) => {
  const socketIds = getReceiverSocketIds(userId);

  if (!socketIds) return;

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("new_notification", notification);
  });
};

export const emitMessage = (userId: string, message: Message) => {
  const socketIds = getReceiverSocketIds(userId);

  if (!socketIds) return;

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("new_message", message);
  });
};

export const emitMessageEdited = (userId: string, message: Message) => {
  const socketIds = getReceiverSocketIds(userId);

  if (!socketIds) return;

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("message_edited", message);
  });
};

export const emitMessageDeleted = (
  userId: string,
  conversationId: string,
  messageId: string
) => {
  const socketIds = getReceiverSocketIds(userId);

  if (!socketIds) return;

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("message_deleted", conversationId, messageId);
  });
};

export const emitMessageSeen = (
  userId: string,
  conversationId: string,
  messageIds: string[]
) => {
  const socketIds = getReceiverSocketIds(userId);

  if (!socketIds) return;

  socketIds.forEach((socketId) => {
    io.to(socketId).emit("message_seen", conversationId, messageIds);
  });
};

const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL!,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId as string;

    if (!userId || userId === "undefined") {
      socket.disconnect();
      return;
    }

    if (!connectedUsers[userId]) {
      connectedUsers[userId] = [];
    }

    connectedUsers[userId].push(socket.id);

    io.emit("get_online_users", Object.keys(connectedUsers));
    console.log(
      `User ${userId} connected. Total connections: ${connectedUsers[userId].length}`
    );

    socket.on(
      "mark_message_seen",
      (conversationId: string, messageIds: string[], senderId: string) => {
        console.log(
          `Marking message ${messageIds} as seen in conversation ${conversationId}`
        );
        emitMessageSeen(senderId, conversationId, messageIds);
      }
    );

    socket.on("disconnect", () => {
      if (!userId || !connectedUsers[userId]) return;

      connectedUsers[userId] = connectedUsers[userId].filter(
        (id) => id !== socket.id
      );

      if (connectedUsers[userId].length === 0) {
        delete connectedUsers[userId];
      }

      io.emit("get_online_users", Object.keys(connectedUsers));
      console.log(
        `User ${userId} disconnected. Remaining connections: ${
          connectedUsers[userId]?.length || 0
        }`
      );
    });
  });

  return io;
};

export default initializeSocket;
