import { Server } from "socket.io";
import http from "http";

import { Notification } from "@prisma/client";

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

const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL!,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
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
      `User ${userId} connected. Total: ${connectedUsers[userId].length}`
    );

    socket.on("disconnect", () => {
      connectedUsers[userId] = connectedUsers[userId].filter(
        (id) => id !== socket.id
      );

      if (connectedUsers[userId].length === 0) {
        delete connectedUsers[userId];
      }

      console.log(
        `User ${userId} disconnected. Remaining: ${
          connectedUsers[userId]?.length || 0
        }`
      );
    });
  });

  return io;
};

export default initializeSocket;
