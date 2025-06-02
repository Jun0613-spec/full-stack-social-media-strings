import { create } from "zustand";
import { io, Socket } from "socket.io-client";

import { Message, Notification } from "@/types/prismaTypes";

import { useNotificationStore } from "./notificationStore";
import { useMessageStore } from "./messageStore";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];

  connect: (userId: string) => void;
  disconnect: () => void;

  sendMessage: (recipientIds: string[], message: Message) => void;
  editMessage: (recipientIds: string[], message: Message) => void;
  deleteMessage: (
    recipientIds: string[],
    conversationId: string,
    messageId: string
  ) => void;
  markMessageAsSeen: (
    conversationId: string,
    messageIds: string[],
    senderId: string
  ) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

  connect: (userId: string) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket = io(import.meta.env.VITE_API_BASE_URL!, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
      set({ isConnected: false });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("new_notification", (notification: Notification) => {
      console.log("New notification received:", notification);

      useNotificationStore.getState().setHasNewNotification(true);
    });

    socket.on("new_message", (message: Message) => {
      useMessageStore.getState().onMessageReceived(message);
    });

    socket.on("message_edited", (editedMessage: Message) => {
      useMessageStore.getState().onMessageUpdated(editedMessage);
    });

    socket.on(
      "message_deleted",
      (conversationId: string, messageId: string) => {
        useMessageStore.getState().onMessageRemoved(conversationId, messageId);
      }
    );

    socket.on(
      "message_seen",
      (conversationId: string, messageIds: string[]) => {
        useMessageStore
          .getState()
          .markMessagesAsSeen(conversationId, messageIds);
      }
    );

    socket.on("get_online_users", (users: string[]) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  sendMessage: (recipientIds: string[], message: Message) => {
    const { socket } = get();
    if (!socket) return;

    useMessageStore.getState().onMessageSent(message);

    recipientIds.forEach((recipientId) => {
      socket.emit("new_message", { ...message, recipientId });
    });
  },

  editMessage: (recipientIds: string[], message: Message) => {
    const { socket } = get();
    if (!socket) return;

    useMessageStore.getState().onMessageUpdated(message);

    recipientIds.forEach((recipientId) => {
      socket.emit("message_edited", { ...message, recipientId });
    });
  },

  deleteMessage: (
    recipientIds: string[],
    conversationId: string,
    messageId: string
  ) => {
    const { socket } = get();
    if (!socket) return;

    useMessageStore.getState().onMessageRemoved(conversationId, messageId);

    recipientIds.forEach((recipientId) => {
      socket.emit("message_deleted", {
        conversationId,
        messageId,
        recipientId
      });
    });
  },

  markMessageAsSeen: (conversationId, messageIds, senderId) => {
    const { socket } = get();
    if (!socket) return;

    const { markMessagesAsSeen } = useMessageStore.getState();

    markMessagesAsSeen(conversationId, messageIds);

    socket.emit("mark_message_seen", conversationId, messageIds, senderId);
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("new_notification");
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_seen");
      socket.off("message_deleted");
      socket.off("get_online_users");

      socket.disconnect();

      set({
        socket: null,
        isConnected: false,
        onlineUsers: []
      });

      console.log("Socket disconnected and cleaned up");
    }
  }
}));
